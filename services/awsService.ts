// AWS Service Integration Layer
// Maps ReasonCare application to AWS infrastructure components

import { 
  BedrockRuntimeClient, 
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand 
} from "@aws-sdk/client-bedrock-runtime";
import { 
  TranscribeClient, 
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand 
} from "@aws-sdk/client-transcribe";
import { 
  DocumentDBClient 
} from "@aws-sdk/client-docdb";
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand 
} from "@aws-sdk/client-s3";
import { 
  CloudWatchClient, 
  PutMetricDataCommand 
} from "@aws-sdk/client-cloudwatch";

// Environment configuration
const AWS_REGION = process.env.REACT_APP_AWS_REGION || 'us-east-1';
const BEDROCK_REGION = process.env.REACT_APP_BEDROCK_REGION || 'us-east-1';
const LAMBDA_ORCHESTRATOR_URL = process.env.REACT_APP_LAMBDA_ORCHESTRATOR_URL;
const DOCDB_ENDPOINT = process.env.REACT_APP_DOCDB_ENDPOINT;
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const KNOWLEDGE_BASE_ID = process.env.REACT_APP_KNOWLEDGE_BASE_ID;

// Initialize AWS clients
const bedrockClient = new BedrockRuntimeClient({ region: BEDROCK_REGION });
const transcribeClient = new TranscribeClient({ region: AWS_REGION });
const s3Client = new S3Client({ region: AWS_REGION });
const cloudWatchClient = new CloudWatchClient({ region: AWS_REGION });

// Agent configuration mapping to AWS services
export const AWS_AGENT_MAPPING = {
  'voice_agent': {
    service: 'transcribe',
    model: 'amazon.transcribe',
    endpoint: 'transcribe'
  },
  'cardiologist_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  },
  'reasoning_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  },
  'pov_summary_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  },
  'electrophysiology_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  },
  'report_summary_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  },
  'interventional_cardiologist_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  },
  'heart_failure_specialist_agent': {
    service: 'bedrock',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    endpoint: 'bedrock-runtime'
  }
};

// Voice Processing Service (Amazon Transcribe)
export const voiceService = {
  async processVoiceInput(audioData: Blob | string): Promise<any> {
    try {
      // If running in demo mode, return mock data
      if (process.env.REACT_APP_DEMO_MODE === 'true') {
        const mockResponse = await import('../mock/symptoms_input.json');
        return { success: true, data: mockResponse.default };
      }

      // Upload audio to S3 first
      const audioKey = `voice-input/${Date.now()}.wav`;
      await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: audioKey,
        Body: audioData as Blob
      }));

      // Start transcription job
      const jobName = `reasoncare-${Date.now()}`;
      const transcriptionResponse = await transcribeClient.send(
        new StartTranscriptionJobCommand({
          TranscriptionJobName: jobName,
          LanguageCode: 'en-US',
          MediaFormat: 'wav',
          Media: {
            MediaFileUri: `s3://${S3_BUCKET}/${audioKey}`
          },
          Settings: {
            VocabularyName: 'medical-vocabulary',
            ShowSpeakerLabels: true,
            MaxSpeakerLabels: 2
          }
        })
      );

      return {
        success: true,
        jobName,
        status: 'processing',
        data: transcriptionResponse
      };

    } catch (error) {
      console.error('Voice processing error:', error);
      throw new Error('Voice processing failed');
    }
  },

  async getTranscriptionResult(jobName: string): Promise<any> {
    try {
      const response = await transcribeClient.send(
        new GetTranscriptionJobCommand({
          TranscriptionJobName: jobName
        })
      );

      return {
        success: true,
        status: response.TranscriptionJob?.TranscriptionJobStatus,
        transcript: response.TranscriptionJob?.Transcript?.TranscriptFileUri
      };

    } catch (error) {
      console.error('Transcription result error:', error);
      throw new Error('Failed to get transcription result');
    }
  }
};

// Multi-Agent Orchestration Service
export const agentOrchestrationService = {
  async invokeDiagnosticAgents(patientData: any, agentsRequested: string[] = []): Promise<any> {
    try {
      // If running in demo mode, return mock data
      if (process.env.REACT_APP_DEMO_MODE === 'true') {
        const mockDiagnosis = await import('../mock/diagnosis_v1.md');
        return {
          success: true,
          diagnosis: 'Unstable Angina Pectoris',
          confidence: 87,
          report: mockDiagnosis.default,
          agents: [
            { name: 'Cardiology Specialist', confidence: 89, status: 'completed' },
            { name: 'Reasoning Agent', confidence: 85, status: 'completed' },
            { name: 'POV Summary Agent', confidence: 87, status: 'completed' }
          ]
        };
      }

      // Call Lambda orchestrator
      const response = await fetch(LAMBDA_ORCHESTRATOR_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AWS_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          request_type: 'diagnosis',
          patient_data: patientData,
          agents: agentsRequested.length > 0 ? agentsRequested : [
            'cardiologist_agent',
            'reasoning_agent',
            'pov_summary_agent'
          ]
        })
      });

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Agent orchestration error:', error);
      throw new Error('Multi-agent diagnosis failed');
    }
  },

  async invokeSpecificAgent(agentName: string, data: any): Promise<any> {
    try {
      const agentConfig = AWS_AGENT_MAPPING[agentName as keyof typeof AWS_AGENT_MAPPING];
      if (!agentConfig) {
        throw new Error(`Unknown agent: ${agentName}`);
      }

      if (agentConfig.service === 'bedrock') {
        return await this.invokeBedrockAgent(agentConfig.model, data);
      } else if (agentConfig.service === 'transcribe') {
        return await voiceService.processVoiceInput(data);
      }

      throw new Error(`Unsupported service: ${agentConfig.service}`);

    } catch (error) {
      console.error(`Error invoking ${agentName}:`, error);
      throw error;
    }
  },

  async invokeBedrockAgent(modelId: string, data: any): Promise<any> {
    try {
      const prompt = this.generatePrompt(data);
      
      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      };

      const command = new InvokeModelCommand({
        modelId,
        body: JSON.stringify(requestBody),
        contentType: 'application/json'
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(Buffer.from(response.body).toString());

      return {
        success: true,
        response: responseBody.content[0].text,
        model: modelId,
        usage: responseBody.usage
      };

    } catch (error) {
      console.error('Bedrock invocation error:', error);
      throw new Error('Bedrock agent invocation failed');
    }
  },

  generatePrompt(data: any): string {
    return `
    You are a specialized medical AI assistant. Analyze the following patient data and provide your professional assessment:
    
    Patient Data: ${JSON.stringify(data, null, 2)}
    
    Please provide:
    1. Your clinical assessment
    2. Confidence level (0-100%)
    3. Key findings and concerns
    4. Recommendations
    5. Next steps
    
    Format your response as a structured medical assessment.
    `;
  }
};

// DocumentDB Integration Service
export const documentDbService = {
  async savePatientData(patientId: string, data: any): Promise<any> {
    try {
      // If running in demo mode, save to localStorage
      if (process.env.REACT_APP_DEMO_MODE === 'true') {
        localStorage.setItem(`patient_${patientId}`, JSON.stringify(data));
        return { success: true, patientId };
      }

      // In production, this would use DocumentDB client
      // For now, using a REST API approach
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ehr/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AWS_ACCESS_TOKEN}`
        },
        body: JSON.stringify(data)
      });

      return await response.json();

    } catch (error) {
      console.error('DocumentDB save error:', error);
      throw new Error('Failed to save patient data');
    }
  },

  async getPatientData(patientId: string): Promise<any> {
    try {
      // If running in demo mode, get from localStorage or mock data
      if (process.env.REACT_APP_DEMO_MODE === 'true') {
        const stored = localStorage.getItem(`patient_${patientId}`);
        if (stored) {
          return { success: true, data: JSON.parse(stored) };
        }
        
        const mockData = await import('../mock/ehr_data.json');
        return { success: true, data: mockData.default };
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ehr/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_AWS_ACCESS_TOKEN}`
        }
      });

      return await response.json();

    } catch (error) {
      console.error('DocumentDB get error:', error);
      throw new Error('Failed to get patient data');
    }
  }
};

// Knowledge Base Integration Service
export const knowledgeBaseService = {
  async queryMedicalGuidelines(query: string): Promise<any> {
    try {
      // If running in demo mode, return mock guidelines
      if (process.env.REACT_APP_DEMO_MODE === 'true') {
        const mockGuidelines = await import('../mock/updated_guidelines.md');
        return {
          success: true,
          guidelines: mockGuidelines.default,
          sources: ['AHA Guidelines', 'ESC Guidelines', 'Hospital Protocols']
        };
      }

      // Use Bedrock Knowledge Base
      const response = await fetch(`${LAMBDA_ORCHESTRATOR_URL}/knowledge-base/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AWS_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          query,
          knowledge_base_id: KNOWLEDGE_BASE_ID,
          max_results: 10
        })
      });

      return await response.json();

    } catch (error) {
      console.error('Knowledge base query error:', error);
      throw new Error('Failed to query medical guidelines');
    }
  }
};

// CloudWatch Metrics Service
export const metricsService = {
  async putMetric(metricName: string, value: number, unit: string = 'Count'): Promise<void> {
    try {
      await cloudWatchClient.send(new PutMetricDataCommand({
        Namespace: 'ReasonCare',
        MetricData: [
          {
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date()
          }
        ]
      }));
    } catch (error) {
      console.error('CloudWatch metrics error:', error);
      // Don't throw - metrics shouldn't break the app
    }
  },

  async recordDiagnosticAccuracy(accuracy: number): Promise<void> {
    await this.putMetric('DiagnosticAccuracy', accuracy, 'Percent');
  },

  async recordAgentInvocation(agentName: string): Promise<void> {
    await this.putMetric(`Agent.${agentName}.Invocations`, 1);
  }
};

// Export all AWS services
export default {
  voice: voiceService,
  agents: agentOrchestrationService,
  documentDb: documentDbService,
  knowledgeBase: knowledgeBaseService,
  metrics: metricsService
};