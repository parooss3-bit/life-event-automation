import { useState, useEffect } from 'react';
import { Video, Loader, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react';
import { apiClient } from '../lib/api';

interface VideoGeneratorProps {
  contactId: string;
  eventId: string;
  recipientName: string;
  senderName: string;
  eventType: string;
  onClose: () => void;
}

interface Avatar {
  id: string;
  name: string;
  preview: string;
}

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
}

export default function VideoGenerator({
  contactId,
  eventId,
  recipientName,
  senderName,
  eventType,
  onClose,
}: VideoGeneratorProps) {
  const [step, setStep] = useState<'options' | 'generating' | 'complete'>('options');
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const [avatarsRes, voicesRes] = await Promise.all([
        apiClient.client.get('/api/v1/videos/avatars'),
        apiClient.client.get('/api/v1/videos/voices'),
      ]);

      setAvatars(avatarsRes.data.avatars);
      setVoices(voicesRes.data.voices);

      if (avatarsRes.data.avatars.length > 0) {
        setSelectedAvatar(avatarsRes.data.avatars[0].id);
      }
      if (voicesRes.data.voices.length > 0) {
        setSelectedVoice(voicesRes.data.voices[0].id);
      }
    } catch (err: any) {
      setError('Failed to load video options');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    try {
      setStep('generating');
      setError(null);
      setGenerationProgress(0);

      const response = await apiClient.client.post('/api/v1/videos/generate', {
        contactId,
        eventId,
        recipientName,
        senderName,
        eventType,
        message: customMessage,
        avatarId: selectedAvatar,
        voiceId: selectedVoice,
      });

      setVideoId(response.data.videoId);

      // Poll for video completion
      pollVideoStatus(response.data.videoId);
    } catch (err: any) {
      setError(err.message || 'Failed to generate video');
      setStep('options');
    }
  };

  const pollVideoStatus = async (vId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    const poll = async () => {
      try {
        const response = await apiClient.client.get(`/api/v1/videos/${vId}/status`);

        if (response.data.status === 'completed') {
          setVideoUrl(response.data.videoUrl);
          setStep('complete');
          setGenerationProgress(100);
        } else if (response.data.status === 'failed') {
          setError('Video generation failed');
          setStep('options');
        } else if (response.data.status === 'processing') {
          setGenerationProgress(Math.min(50 + (attempts * 2), 95));
          attempts++;

          if (attempts < maxAttempts) {
            setTimeout(poll, 5000); // Poll every 5 seconds
          } else {
            setError('Video generation timed out');
            setStep('options');
          }
        }
      } catch (err: any) {
        console.error('Error polling video status:', err);
        attempts++;

        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError('Failed to check video status');
          setStep('options');
        }
      }
    };

    poll();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <Loader className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading video options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center space-x-3">
            <Video className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Generate Video Message</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Options step */}
          {step === 'options' && (
            <div className="space-y-6">
              {/* Message preview */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-2">Message Preview</p>
                <p className="text-sm text-blue-800">
                  <strong>To:</strong> {recipientName}
                  <br />
                  <strong>From:</strong> {senderName}
                  <br />
                  <strong>Occasion:</strong> {eventType}
                </p>
              </div>

              {/* Avatar selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Avatar
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedAvatar === avatar.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <img
                        src={avatar.preview}
                        alt={avatar.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <p className="text-xs font-medium text-gray-900">{avatar.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} ({voice.gender}, {voice.language})
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t space-x-3">
                <button
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateVideo}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Generate Video</span>
                </button>
              </div>
            </div>
          )}

          {/* Generating step */}
          {step === 'generating' && (
            <div className="text-center py-12 space-y-6">
              <Loader className="w-16 h-16 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-gray-900 font-semibold mb-2">
                  Generating your personalized video...
                </p>
                <p className="text-sm text-gray-600">
                  This may take a few minutes. Please don't close this window.
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{generationProgress}% complete</p>
            </div>
          )}

          {/* Complete step */}
          {step === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Video Ready!
                </h3>
                <p className="text-gray-600">
                  Your personalized video message has been created successfully.
                </p>
              </div>

              {/* Video preview */}
              {videoUrl && (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t space-x-3">
                <button
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  Close
                </button>
                {videoUrl && (
                  <a
                    href={videoUrl}
                    download
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Video</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
