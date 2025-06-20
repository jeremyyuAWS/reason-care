// Enhanced API Service Layer with AWS Integration
// Seamlessly toggle between Demo Mode and AWS Production Mode

import awsService from './awsService';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.reasoncare.io';

// Base API configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN || ''}`
  },
  timeout: 10000
};

// Generic API call wrapper with AWS integration
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  if (DEMO_MODE) {
    // Return mock data based on endpoint
    return handleDemoMode(endpoint, options);
  }

  // Use AWS services for production
  return handleProductionMode(endpoint, options);
}

// Production mode with AWS services
async function handleProductionMode(endpoint: string, options: RequestInit): Promise<any> {
  const method = options.method || 'GET';
  
  try {
    // Route to appropriate AWS service based on endpoint
    if (endpoint === '/api/intake/voice' && method === 'POST') {
      const audioData = JSON.parse(options.body as string);
      return await awsService.voice.processVoiceInput(audioData.audio);
    }

    if (endpoint.startsWith('/api/ehr/')) {
      const patientId = endpoint.split('/').pop();
      if (method === 'GET') {
        return await awsService.documentDb.getPatientData(patientId!);
      } else if (method === 'PUT') {
        const data = JSON.parse(options.body as string);
        return await awsService.documentDb.savePatientData(patientId!, data);
      }
    }

    if (endpoint === '/api/diagnosis/generate' && method === 'POST') {
      const data = JSON.parse(options.body as string);
      return await awsService.agents.invokeDiagnosticAgents(data, [
        'cardiologist_agent',
        'reasoning_agent', 
        'pov_summary_agent'
      ]);
    }

    if (endpoint === '/api/diagnosis/update' && method === 'PUT') {
      const data = JSON.parse(options.body as string);
      // Record the update in DocumentDB
      await awsService.documentDb.savePatientData(data.patientId, {
        diagnosis: data,
        updated_by: 'resident',
        timestamp: new Date().toISOString()
      });
      return { success: true, message: 'Diagnosis updated successfully' };
    }

    if (endpoint === '/api/guidelines/update' && method === 'POST') {
      const feedback = JSON.parse(options.body as string);
      return await awsService.knowledgeBase.queryMedicalGuidelines(feedback.query);
    }

    // Fallback to standard HTTP for unmapped endpoints
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
    console.error('Production API Error:', error);
    throw error;
  }
}

// Demo mode data handler (existing functionality)
async function handleDemoMode(endpoint: string, options: RequestInit): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const method = options.method || 'GET';
  
  // Patient Intake endpoints
  if (endpoint === '/api/intake/voice' && method === 'POST') {
    const symptomsData = await fetch('/mock/symptoms_input.json');
    return {
      success: true,
      data: await symptomsData.json(),
      message: 'Symptoms processed successfully'
    };
  }

  // EHR endpoints
  if (endpoint.startsWith('/api/ehr/') && method === 'GET') {
    const ehrData = await fetch('/mock/ehr_data.json');
    return {
      success: true,
      data: await ehrData.json(),
      message: 'EHR data retrieved successfully'
    };
  }

  if (endpoint.startsWith('/api/ehr/') && method === 'PUT') {
    const ehrData = await fetch('/mock/ehr_data.json');
    const existingData = await ehrData.json();
    return {
      success: true,
      data: { ...existingData, ...JSON.parse(options.body as string) },
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

// Enhanced service exports with AWS integration
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
    }),

  // Direct AWS service access for advanced features
  aws: {
    startTranscription: (audioData: Blob) => 
      DEMO_MODE ? 
        Promise.resolve({ jobName: 'demo-job', status: 'processing' }) :
        awsService.voice.processVoiceInput(audioData),
    
    getTranscriptionResult: (jobName: string) =>
      DEMO_MODE ?
        Promise.resolve({ status: 'completed', transcript: 'Mock transcript' }) :
        awsService.voice.getTranscriptionResult(jobName)
  }
};

export const ehrService = {
  getPatientData: (patientId: string) =>
    apiCall(`/api/ehr/${patientId}`, { method: 'GET' }),

  updatePatientData: (patientId: string, data: any) =>
    apiCall(`/api/ehr/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Direct AWS DocumentDB access
  aws: {
    saveToDocumentDB: (patientId: string, data: any) =>
      DEMO_MODE ?
        Promise.resolve({ success: true }) :
        awsService.documentDb.savePatientData(patientId, data),
    
    getFromDocumentDB: (patientId: string) =>
      DEMO_MODE ?
        Promise.resolve({ data: {} }) :
        awsService.documentDb.getPatientData(patientId)
  }
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
    }),

  // Direct AWS Bedrock agent access
  aws: {
    invokeMultipleAgents: (patientData: any, agents: string[]) =>
      DEMO_MODE ?
        Promise.resolve({ diagnosis: 'Mock diagnosis', confidence: 85 }) :
        awsService.agents.invokeDiagnosticAgents(patientData, agents),
    
    invokeSpecificAgent: (agentName: string, data: any) =>
      DEMO_MODE ?
        Promise.resolve({ response: 'Mock agent response', confidence: 80 }) :
        awsService.agents.invokeSpecificAgent(agentName, data)
  }
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
    }),

  // Direct AWS Knowledge Base access
  aws: {
    queryKnowledgeBase: (query: string) =>
      DEMO_MODE ?
        Promise.resolve({ guidelines: 'Mock guidelines', sources: [] }) :
        awsService.knowledgeBase.queryMedicalGuidelines(query)
  }
};

// Configuration utilities with AWS integration
export const apiUtils = {
  isDemoMode: () => DEMO_MODE,
  getApiBaseUrl: () => API_BASE_URL,
  setAuthToken: (token: string) => {
    apiConfig.headers.Authorization = `Bearer ${token}`;
  },
  
  // AWS-specific utilities
  aws: {
    getRegion: () => process.env.REACT_APP_AWS_REGION,
    getBedrockRegion: () => process.env.REACT_APP_BEDROCK_REGION,
    isAwsConfigured: () => !!(
      process.env.REACT_APP_LAMBDA_ORCHESTRATOR_URL &&
      process.env.REACT_APP_DOCDB_ENDPOINT &&
      process.env.REACT_APP_S3_BUCKET
    ),
    recordMetric: (metricName: string, value: number) =>
      DEMO_MODE ? 
        Promise.resolve() :
        awsService.metrics.putMetric(metricName, value)
  }
};

export default {
  intake: intakeService,
  ehr: ehrService,
  diagnosis: diagnosisService,
  guidelines: guidelinesService,
  utils: apiUtils
};