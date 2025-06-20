// API Service Layer - Toggle between Demo Mode and Production APIs
// Based on REACT_APP_DEMO_MODE environment variable

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.reasoncare.io';

// Mock data imports for demo mode
import symptomsData from '../mock/symptoms_input.json';
import ehrData from '../mock/ehr_data.json';

// Base API configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN || ''}`
  },
  timeout: 10000
};

// Generic API call wrapper
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  if (DEMO_MODE) {
    // Return mock data based on endpoint
    return handleDemoMode(endpoint, options);
  }

  try {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

// Demo mode data handler
async function handleDemoMode(endpoint: string, options: RequestInit): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const method = options.method || 'GET';
  
  // Patient Intake endpoints
  if (endpoint === '/api/intake/voice' && method === 'POST') {
    return {
      success: true,
      data: symptomsData,
      message: 'Symptoms processed successfully'
    };
  }

  // EHR endpoints
  if (endpoint.startsWith('/api/ehr/') && method === 'GET') {
    return {
      success: true,
      data: ehrData,
      message: 'EHR data retrieved successfully'
    };
  }

  if (endpoint.startsWith('/api/ehr/') && method === 'PUT') {
    return {
      success: true,
      data: { ...ehrData, ...JSON.parse(options.body as string) },
      message: 'EHR data updated successfully'
    };
  }

  // Diagnosis endpoints
  if (endpoint === '/api/diagnosis/generate' && method === 'POST') {
    const diagnosisResponse = await fetch('/mock/diagnosis_v1.md');
    const diagnosisText = await diagnosisResponse.text();
    
    return {
      success: true,
      data: {
        diagnosis: 'Unstable Angina Pectoris',
        confidence: 87,
        report: diagnosisText,
        agents: [
          { name: 'Cardiology Specialist', confidence: 89, status: 'completed' },
          { name: 'Emergency Medicine', confidence: 85, status: 'completed' },
          { name: 'Internal Medicine', confidence: 78, status: 'completed' }
        ]
      },
      message: 'Diagnosis generated successfully'
    };
  }

  if (endpoint === '/api/diagnosis/update' && method === 'PUT') {
    const updatedDiagnosisResponse = await fetch('/mock/diagnosis_v2.md');
    const updatedDiagnosisText = await updatedDiagnosisResponse.text();
    
    return {
      success: true,
      data: {
        diagnosis: 'Unstable Angina Pectoris',
        confidence: 89,
        report: updatedDiagnosisText,
        modifiedBy: 'Dr. Michael Chen, PGY-3'
      },
      message: 'Diagnosis updated successfully'
    };
  }

  if (endpoint === '/api/diagnosis/approve' && method === 'POST') {
    const feedbackResponse = await fetch('/mock/doctor_feedback.md');
    const feedbackText = await feedbackResponse.text();
    
    return {
      success: true,
      data: {
        status: 'approved',
        feedback: feedbackText,
        reviewedBy: 'Dr. Sarah Williams, MD'
      },
      message: 'Diagnosis approved successfully'
    };
  }

  if (endpoint === '/api/diagnosis/reject' && method === 'POST') {
    return {
      success: true,
      data: {
        status: 'rejected',
        reason: 'Requires additional workup',
        reviewedBy: 'Dr. Sarah Williams, MD'
      },
      message: 'Diagnosis rejected - requires revision'
    };
  }

  // Guidelines endpoints
  if (endpoint === '/api/guidelines/update' && method === 'POST') {
    const guidelinesResponse = await fetch('/mock/updated_guidelines.md');
    const guidelinesText = await guidelinesResponse.text();
    
    return {
      success: true,
      data: {
        version: '2.1.3',
        updatedGuidelines: guidelinesText,
        casesAffected: 156
      },
      message: 'Guidelines updated successfully'
    };
  }

  // Default response for unmapped endpoints
  return {
    success: false,
    error: 'Endpoint not implemented in demo mode',
    endpoint,
    method
  };
}

// Exported API service functions
export const intakeService = {
  processVoiceInput: (voiceData: any) => 
    apiCall('/api/intake/voice', {
      method: 'POST',
      body: JSON.stringify(voiceData)
    }),

  processTextInput: (textData: any) =>
    apiCall('/api/intake/text', {
      method: 'POST', 
      body: JSON.stringify(textData)
    })
};

export const ehrService = {
  getPatientData: (patientId: string) =>
    apiCall(`/api/ehr/${patientId}`, { method: 'GET' }),

  updatePatientData: (patientId: string, data: any) =>
    apiCall(`/api/ehr/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

export const diagnosisService = {
  generateDiagnosis: (data: any) =>
    apiCall('/api/diagnosis/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateDiagnosis: (diagnosisId: string, updates: any) =>
    apiCall('/api/diagnosis/update', {
      method: 'PUT',
      body: JSON.stringify({ diagnosisId, ...updates })
    }),

  approveDiagnosis: (diagnosisId: string, feedback: any) =>
    apiCall('/api/diagnosis/approve', {
      method: 'POST',
      body: JSON.stringify({ diagnosisId, ...feedback })
    }),

  rejectDiagnosis: (diagnosisId: string, reason: string) =>
    apiCall('/api/diagnosis/reject', {
      method: 'POST', 
      body: JSON.stringify({ diagnosisId, reason })
    })
};

export const guidelinesService = {
  updateGuidelines: (feedback: any) =>
    apiCall('/api/guidelines/update', {
      method: 'POST',
      body: JSON.stringify(feedback)
    }),

  getGuidelines: (version?: string) =>
    apiCall(`/api/guidelines${version ? `?version=${version}` : ''}`, {
      method: 'GET'
    })
};

// Configuration utilities
export const apiUtils = {
  isDemoMode: () => DEMO_MODE,
  getApiBaseUrl: () => API_BASE_URL,
  setAuthToken: (token: string) => {
    apiConfig.headers.Authorization = `Bearer ${token}`;
  }
};

export default {
  intake: intakeService,
  ehr: ehrService,
  diagnosis: diagnosisService,
  guidelines: guidelinesService,
  utils: apiUtils
};