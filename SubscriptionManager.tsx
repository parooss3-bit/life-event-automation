import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { CreditCard, AlertCircle } from 'lucide-react';

interface Subscription {
  tierId: string;
  tier: {
    name: string;
    price: number;
    features: string[];
  };
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.client.get('/api/v1/subscriptions/current');
      setSubscription(response.data);
    } catch (err: any) {
      setError('Failed to load subscription details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await apiClient.client.post('/api/v1/subscriptions/cancel');
      await fetchSubscription();
    } catch (err: any) {
      setError('Failed to cancel subscription');
      console.error(err);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await apiClient.client.post('/api/v1/subscriptions/reactivate');
      await fetchSubscription();
    } catch (err: any) {
      setError('Failed to reactivate subscription');
      console.error(err);
    }
  };

  const handleBillingPortal = async () => {
    try {
      const response = await apiClient.client.get('/api/v1/subscriptions/billing-portal', {
        params: { returnUrl: window.location.href },
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      setError('Failed to open billing portal');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Unable to load subscription information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Current plan */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>

        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {subscription.tier.name} Plan
            </h3>
            <p className="text-gray-600 mt-1">
              ${subscription.tier.price}/month
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold text-green-600 capitalize">
              {subscription.status}
            </p>
          </div>
        </div>

        {/* Billing period */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600">Current period starts</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(subscription.currentPeriodStart).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current period ends</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Cancellation status */}
        {subscription.cancelAtPeriodEnd && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              Your subscription will be cancelled at the end of your current billing period.
            </p>
          </div>
        )}

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Included Features</h4>
          <ul className="space-y-2">
            {subscription.tier.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-700">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBillingPortal}
            className="flex items-center justify-center space-x-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Manage Billing</span>
          </button>

          {subscription.cancelAtPeriodEnd ? (
            <button
              onClick={handleReactivateSubscription}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>Reactivate Subscription</span>
            </button>
          ) : (
            <button
              onClick={handleCancelSubscription}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <span>Cancel Subscription</span>
            </button>
          )}
        </div>
      </div>

      {/* Upgrade CTA */}
      {subscription.tierId === 'free' && (
        <div className="card bg-gradient-to-r from-primary to-secondary text-white">
          <h3 className="text-xl font-bold mb-2">Ready to unlock more features?</h3>
          <p className="mb-4">Upgrade to Pro or Business to get AI video generation, smart gift recommendations, and more.</p>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Plans
          </button>
        </div>
      )}
    </div>
  );
}
