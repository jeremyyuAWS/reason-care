"""
ReasonCare AI Agent Orchestrator
Coordinates multiple specialized medical AI agents using Amazon Bedrock
"""

import json
import boto3
import os
from typing import Dict, List, Any

# Initialize AWS clients
bedrock = boto3.client('bedrock-runtime')
docdb = boto3.client('docdb')
transcribe = boto3.client('transcribe')

# Environment variables
BEDROCK_REGION = os.environ.get('BEDROCK_REGION', 'us-east-1')
KNOWLEDGE_BASE_ID = os.environ.get('KNOWLEDGE_BASE_ID')
DOCDB_ENDPOINT = os.environ.get('DOCDB_ENDPOINT')

# Agent configurations based on architecture diagram
AGENT_CONFIGS = {
    'voice_agent': {
        'model_id': 'amazon.transcribe',
        'role': 'Convert voice input to structured text',
        'specialization': 'voice_processing'
    },
    'cardiologist_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'Primary cardiology diagnostic assessment',
        'specialization': 'cardiology'
    },
    'reasoning_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'Clinical reasoning and explanation generation',
        'specialization': 'clinical_reasoning'
    },
    'pov_summary_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'Multi-agent synthesis and point-of-view summary',
        'specialization': 'synthesis'
    },
    'electrophysiology_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'ECG analysis and rhythm interpretation',
        'specialization': 'electrophysiology'
    },
    'report_summary_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'Clinical report generation and formatting',
        'specialization': 'reporting'
    },
    'interventional_cardiologist_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'Interventional procedure recommendations',
        'specialization': 'interventional_cardiology'
    },
    'heart_failure_specialist_agent': {
        'model_id': 'anthropic.claude-3-sonnet-20240229-v1:0',
        'role': 'Heart failure specific diagnostic algorithms',
        'specialization': 'heart_failure'
    }
}

def lambda_handler(event, context):
    """
    Main Lambda handler for AI agent orchestration
    """
    try:
        # Parse the incoming request
        request_type = event.get('request_type', 'diagnosis')
        patient_data = event.get('patient_data', {})
        agents_requested = event.get('agents', ['cardiologist_agent', 'reasoning_agent'])
        
        # Route to appropriate handler
        if request_type == 'voice_processing':
            response = handle_voice_processing(event)
        elif request_type == 'diagnosis':
            response = handle_diagnosis_request(patient_data, agents_requested)
        elif request_type == 'report_generation':
            response = handle_report_generation(event)
        else:
            response = {
                'statusCode': 400,
                'body': json.dumps({'error': f'Unknown request type: {request_type}'})
            }
        
        return response
        
    except Exception as e:
        print(f"Error in agent orchestrator: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }

def handle_voice_processing(event):
    """
    Process voice input using Amazon Transcribe
    """
    try:
        audio_data = event.get('audio_data')
        if not audio_data:
            raise ValueError("No audio data provided")
        
        # Start transcription job
        job_name = f"reasoncare-transcription-{context.aws_request_id}"
        
        response = transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode='en-US',
            MediaFormat='wav',
            Media={'MediaFileUri': audio_data},
            Settings={
                'VocabularyName': 'medical-vocabulary',
                'ShowSpeakerLabels': True,
                'MaxSpeakerLabels': 2
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'success': True,
                'transcription_job_name': job_name,
                'status': 'processing'
            })
        }
        
    except Exception as e:
        print(f"Voice processing error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Voice processing failed'})
        }

def handle_diagnosis_request(patient_data: Dict, agents_requested: List[str]):
    """
    Coordinate multiple AI agents for diagnosis generation
    """
    try:
        agent_responses = {}
        
        # Process each requested agent
        for agent_name in agents_requested:
            if agent_name in AGENT_CONFIGS:
                agent_config = AGENT_CONFIGS[agent_name]
                response = invoke_bedrock_agent(agent_config, patient_data)
                agent_responses[agent_name] = response
        
        # Synthesize responses using POV Summary Agent
        synthesis = synthesize_agent_responses(agent_responses, patient_data)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'success': True,
                'diagnosis': synthesis,
                'agent_responses': agent_responses,
                'confidence': calculate_overall_confidence(agent_responses)
            })
        }
        
    except Exception as e:
        print(f"Diagnosis request error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Diagnosis generation failed'})
        }

def invoke_bedrock_agent(agent_config: Dict, patient_data: Dict):
    """
    Invoke a specific Bedrock model for an agent
    """
    try:
        # Prepare the prompt based on agent specialization
        prompt = generate_agent_prompt(agent_config, patient_data)
        
        # Prepare the request body
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 4000,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        # Invoke Bedrock model
        response = bedrock.invoke_model(
            modelId=agent_config['model_id'],
            body=json.dumps(request_body),
            contentType='application/json'
        )
        
        # Parse response
        response_body = json.loads(response['body'].read())
        
        return {
            'agent': agent_config['role'],
            'specialization': agent_config['specialization'],
            'response': response_body['content'][0]['text'],
            'model_id': agent_config['model_id'],
            'status': 'completed'
        }
        
    except Exception as e:
        print(f"Bedrock invocation error for {agent_config['role']}: {str(e)}")
        return {
            'agent': agent_config['role'],
            'specialization': agent_config['specialization'],
            'response': f"Error: {str(e)}",
            'status': 'error'
        }

def generate_agent_prompt(agent_config: Dict, patient_data: Dict):
    """
    Generate specialized prompts for each agent type
    """
    specialization = agent_config['specialization']
    base_prompt = f"""
You are a specialized medical AI agent focusing on {specialization}.
Patient Data: {json.dumps(patient_data, indent=2)}

Please analyze this case from your specialty perspective and provide:
1. Your assessment
2. Confidence level (0-100%)
3. Key findings
4. Recommendations specific to your specialty
5. Any concerns or red flags

Respond in a structured format suitable for integration with other specialist opinions.
"""
    
    # Add specialization-specific instructions
    if specialization == 'cardiology':
        base_prompt += """
Focus on cardiovascular assessment, risk factors, and cardiac-specific diagnostics.
Consider chest pain characteristics, cardiac risk factors, and need for cardiac workup.
"""
    elif specialization == 'electrophysiology':
        base_prompt += """
Focus on cardiac rhythm analysis, ECG interpretation, and electrophysiological considerations.
Analyze any rhythm abnormalities and their clinical significance.
"""
    elif specialization == 'heart_failure':
        base_prompt += """
Focus on heart failure assessment, fluid status, and HF-specific diagnostics.
Consider BNP/NT-proBNP levels, echocardiographic findings, and HF staging.
"""
    elif specialization == 'interventional_cardiology':
        base_prompt += """
Focus on need for invasive procedures, coronary angiography indications, and intervention planning.
Consider high-risk features requiring urgent intervention.
"""
    elif specialization == 'clinical_reasoning':
        base_prompt += """
Focus on logical clinical reasoning, differential diagnosis development, and evidence-based analysis.
Provide clear reasoning chains and clinical decision-making rationale.
"""
    
    return base_prompt

def synthesize_agent_responses(agent_responses: Dict, patient_data: Dict):
    """
    Use POV Summary Agent to synthesize multiple agent responses
    """
    try:
        synthesis_prompt = f"""
You are the Point-of-View Summary Agent responsible for synthesizing multiple specialist opinions into a coherent diagnostic assessment.

Patient Data: {json.dumps(patient_data, indent=2)}

Specialist Opinions:
{json.dumps(agent_responses, indent=2)}

Please provide a synthesized assessment that includes:
1. Primary diagnosis with confidence level
2. Differential diagnoses
3. Synthesis of specialist recommendations
4. Overall risk assessment
5. Immediate action items
6. Follow-up recommendations

Present this as a structured clinical report suitable for physician review.
"""
        
        pov_agent_config = AGENT_CONFIGS['pov_summary_agent']
        return invoke_bedrock_agent(pov_agent_config, {'synthesis_prompt': synthesis_prompt})
        
    except Exception as e:
        print(f"Synthesis error: {str(e)}")
        return {'error': 'Synthesis failed'}

def calculate_overall_confidence(agent_responses: Dict):
    """
    Calculate overall confidence based on agent responses
    """
    try:
        confidences = []
        for agent_response in agent_responses.values():
            # Extract confidence from response text (simplified)
            response_text = agent_response.get('response', '')
            # This would need more sophisticated parsing in production
            confidences.append(75)  # Placeholder
        
        if confidences:
            return sum(confidences) / len(confidences)
        return 0
        
    except Exception as e:
        print(f"Confidence calculation error: {str(e)}")
        return 0

def handle_report_generation(event):
    """
    Generate clinical reports using Report Summary Agent
    """
    try:
        diagnosis_data = event.get('diagnosis_data', {})
        report_type = event.get('report_type', 'standard')
        
        report_agent_config = AGENT_CONFIGS['report_summary_agent']
        report_response = invoke_bedrock_agent(report_agent_config, {
            'report_type': report_type,
            'diagnosis_data': diagnosis_data
        })
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'success': True,
                'report': report_response
            })
        }
        
    catch Exception as e:
        print(f"Report generation error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Report generation failed'})
        }