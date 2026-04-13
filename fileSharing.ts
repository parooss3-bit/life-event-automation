import { apiClient } from './api'

export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  uploadedBy: string
}

export class FileSharingService {
  private maxFileSize = 10 * 1024 * 1024 // 10MB
  private allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`,
      }
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed. Allowed types: images, PDF, Word, Excel',
      }
    }

    return { valid: true }
  }

  async uploadFile(file: File): Promise<FileAttachment> {
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    try {
      const response = await apiClient.uploadFile(file)
      return {
        id: response.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: response.url,
        uploadedAt: new Date(),
        uploadedBy: 'current-user', // Should be set to actual user ID
      }
    } catch (error) {
      throw new Error('File upload failed')
    }
  }

  async uploadMultiple(files: File[]): Promise<FileAttachment[]> {
    const uploads = files.map(file => this.uploadFile(file))
    return Promise.all(uploads)
  }

  getFileIcon(type: string): string {
    if (type.startsWith('image/')) return '🖼️'
    if (type === 'application/pdf') return '📄'
    if (type.includes('word')) return '📝'
    if (type.includes('sheet')) return '📊'
    return '📎'
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          const maxWidth = 200
          const maxHeight = 200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }
}

export const fileSharingService = new FileSharingService()
