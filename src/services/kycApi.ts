/**
 * SwiftEarn KYC API Service
 * Separate server for KYC document and video uploads
 * Base URL: https://kyc.swiftearn.us (configurable)
 * 
 * This service handles all KYC-related uploads including:
 * - Document verification
 * - Selfie video liveness check
 */

// KYC API Configuration
export const KYC_API_CONFIG = {
  BASE_URL: 'https://kyc.swiftearn.us',
  TIMEOUT: 60000, // Longer timeout for file uploads
  HEADERS: {
    'Accept': 'application/json',
  },
};

/**
 * Update the KYC base URL if needed (for development/staging)
 */
export function updateKycBaseUrl(newUrl: string) {
  KYC_API_CONFIG.BASE_URL = newUrl;
}

/**
 * Get authorization headers for KYC requests
 */
function getKycAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('swiftearn_token');
  if (token) {
    return {
      ...KYC_API_CONFIG.HEADERS,
      'Authorization': `Bearer ${token}`,
    };
  }
  return KYC_API_CONFIG.HEADERS;
}

/**
 * Generic KYC API request handler
 */
async function kycApiRequest<T = any>(
  endpoint: string,
  method: string = 'GET',
  formData?: FormData
): Promise<T> {
  const url = `${KYC_API_CONFIG.BASE_URL}${endpoint}`;
  const headers = getKycAuthHeaders();

  const config: RequestInit = {
    method,
    headers,
  };

  if (formData && (method === 'POST' || method === 'PUT')) {
    config.body = formData;
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'KYC API request failed',
        errors: responseData.errors || null,
      };
    }

    return responseData;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error. Please check your connection.',
      errors: null,
    };
  }
}

// ============================================
// KYC TYPES
// ============================================

export type DocumentType = 'passport' | 'driver_license' | 'national_id';
export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface KycDocument {
  id: number;
  user_id: number;
  document_type: DocumentType;
  document_number: string;
  front_image_url: string;
  back_image_url?: string;
  status: KycStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface KycSelfieVideo {
  id: number;
  user_id: number;
  video_url: string;
  duration_seconds: number;
  status: KycStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface KycSubmission {
  user_id: number;
  document_type: DocumentType;
  document_number: string;
  full_name: string;
  date_of_birth: string;
  country: string;
  status: KycStatus;
  documents: KycDocument[];
  selfie_video?: KycSelfieVideo;
  submitted_at: string;
}

// ============================================
// KYC APIs
// ============================================

export const kycApi = {
  /**
   * Get KYC submission status
   */
  async getKycStatus(): Promise<KycSubmission> {
    return kycApiRequest('/api/kyc/status', 'GET');
  },

  /**
   * Upload identity document (front side)
   * @param file - Image file (JPEG, PNG)
   * @param documentType - Type of document
   * @param documentNumber - Document ID number
   */
  async uploadDocumentFront(
    file: File,
    documentType: DocumentType,
    documentNumber: string,
    additionalData?: {
      full_name?: string;
      date_of_birth?: string;
      country?: string;
    }
  ): Promise<{ document: KycDocument; message: string }> {
    const formData = new FormData();
    formData.append('document_front', file);
    formData.append('document_type', documentType);
    formData.append('document_number', documentNumber);

    if (additionalData?.full_name) {
      formData.append('full_name', additionalData.full_name);
    }
    if (additionalData?.date_of_birth) {
      formData.append('date_of_birth', additionalData.date_of_birth);
    }
    if (additionalData?.country) {
      formData.append('country', additionalData.country);
    }

    return kycApiRequest('/api/kyc/document/front', 'POST', formData);
  },

  /**
   * Upload identity document (back side)
   * @param file - Image file (JPEG, PNG)
   * @param documentId - ID of the document record from front upload
   */
  async uploadDocumentBack(
    file: File,
    documentId: number
  ): Promise<{ document: KycDocument; message: string }> {
    const formData = new FormData();
    formData.append('document_back', file);
    formData.append('document_id', documentId.toString());

    return kycApiRequest('/api/kyc/document/back', 'POST', formData);
  },

  /**
   * Upload selfie video for liveness check
   * @param file - Video file (MP4, MOV, WebM)
   * @param duration - Video duration in seconds
   */
  async uploadSelfieVideo(
    file: File,
    duration: number
  ): Promise<{ video: KycSelfieVideo; message: string }> {
    const formData = new FormData();
    formData.append('selfie_video', file);
    formData.append('duration', duration.toString());

    return kycApiRequest('/api/kyc/video', 'POST', formData);
  },

  /**
   * Submit KYC for review
   * This finalizes the KYC submission after all documents are uploaded
   */
  async submitForReview(): Promise<{ message: string; status: KycStatus }> {
    return kycApiRequest('/api/kyc/submit', 'POST');
  },

  /**
   * Delete a document (if not yet submitted for review)
   */
  async deleteDocument(documentId: number): Promise<{ message: string }> {
    return kycApiRequest(`/api/kyc/document/${documentId}`, 'POST');
  },

  /**
   * Delete selfie video (if not yet submitted for review)
   */
  async deleteSelfieVideo(videoId: number): Promise<{ message: string }> {
    return kycApiRequest(`/api/kyc/video/${videoId}`, 'POST');
  },
};

/**
 * Helper function to validate file types
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validImageTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG and PNG images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
}

/**
 * Helper function to validate video files
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  const maxDuration = 60; // 60 seconds

  if (!validVideoTypes.includes(file.type)) {
    return { valid: false, error: 'Only MP4, MOV, and WebM videos are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Video size must be less than 50MB' };
  }

  return { valid: true };
}

export default kycApi;
