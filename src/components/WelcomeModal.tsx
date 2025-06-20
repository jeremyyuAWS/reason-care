import React from 'react';
import { X, HelpCircle, Settings, Database, Stethoscope, User, Heart, AlertTriangle, Cloud, Cpu, Server } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  const tabs = [
    {
      name: 'Patient Intake',
      icon: User,
      description: 'Voice/chat symptom intake with clarifying questions',
      api: 'POST /api/intake/voice',
      aws_service: 'Amazon Transcribe + Bedrock',
      requirements: 'Real-time voice-to-text with medical vocabulary'
    },
    {
      name: 'EHR View',
      icon: Heart,
      description: 'Review/edit patient medical history',
      api: 'GET/PUT /api/ehr/:patientId',
      aws_service: 'DocumentDB',
      requirements: 'HIPAA-compliant patient data storage'
    },
    {
      name: 'Diagnosis Generation',
      icon: Stethoscope,
      description: 'Multi-agent AI generates diagnosis from EHR/symptoms',
      api: 'POST /api/diagnosis/generate',
      aws_service: 'Amazon Bedrock (Multiple Agents)',
      requirements: 'Specialized cardiology, reasoning, and summary agents'
    },
    {
      name: 'Resident Review',
      icon: User,
      description: 'Review/edit diagnosis before final sign-off',
      api: 'PUT /api/diagnosis/update',
      aws_service: 'DocumentDB + SNS',
      requirements: 'Medical resident authentication and workflow'
    },
    {
      name: 'Senior Review',
      icon: AlertTriangle,
      description: 'Final approval or feedback to regenerate',
      api: 'POST /api/diagnosis/approve OR /reject',
      aws_service: 'DocumentDB + SNS',
      requirements: 'Senior physician authentication and approval workflow'
    },
    {
      name: 'Feedback & Guidelines',
      icon: Database,
      description: 'Update internal guidelines with doctor feedback',
      api: 'POST /api/guidelines/update',
      aws_service: 'Bedrock Knowledge Base + Vector DB',
      requirements: 'AI model retraining and guideline management system'
    }
  ];

  const awsServices = [
    {
      name: 'Amazon Bedrock',
      icon: Cpu,
      description: '8 specialized AI agents for medical diagnosis',
      agents: ['Cardiologist', 'Reasoning', 'POV Summary', 'Electrophysiology', 'Report Summary', 'Interventional', 'Heart Failure', 'Voice Processing']
    },
    {
      name: 'DocumentDB',
      icon: Database,
      description: 'HIPAA-compliant patient data storage',
      features: ['Multi-AZ deployment', 'Encrypted at rest', 'Continuous backup']
    },
    {
      name: 'Infrastructure',
      icon: Server,
      description: 'Production-grade AWS architecture',
      features: ['ECS/EKS containers', 'ALB with WAF', 'VPC with security groups', 'Auto-scaling']
    },
    {
      name: 'Security & Compliance',
      icon: AlertTriangle,
      description: 'HIPAA-ready security controls',
      features: ['KMS encryption', 'VPC endpoints', 'CloudTrail logging', 'Access controls']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">ReasonCare Developer Guide</h2>
                <p className="text-blue-100">Explainable AI for Confident Medical Decisions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Cloud className="w-5 h-5 mr-2" />
              AWS Architecture Overview
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              ReasonCare is designed to leverage AWS's comprehensive healthcare and AI services for a production-ready, scalable diagnostic assistant platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-800"><strong>Demo Mode</strong> — Mock data for quick demos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-blue-800"><strong>Production Mode</strong> — Full AWS integration</span>
              </div>
            </div>
          </div>

          {/* AWS Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2 text-gray-600" />
              AWS Services Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {awsServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="space-y-1">
                          {('agents' in service ? service.agents : service.features).map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-500 flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Workflow */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              Application Workflow & API Mapping
            </h3>
            <div className="space-y-3">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{tab.name}</h4>
                          <p className="text-sm text-gray-600">{tab.description}</p>
                        </div>
                        <div>
                          <div className="bg-gray-50 rounded p-2 mb-1">
                            <code className="text-xs text-gray-800">{tab.api}</code>
                          </div>
                          <p className="text-xs text-blue-600 font-medium">{tab.aws_service}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{tab.requirements}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deployment Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">AWS Deployment Setup</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">1. Infrastructure Deployment</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  <code className="text-gray-800">cd aws/terraform && terraform init && terraform apply</code>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">2. Environment Configuration</h4>
                <div className="space-y-1">
                  <div className="bg-white p-2 rounded border">
                    <code className="text-xs text-gray-800">REACT_APP_DEMO_MODE=false</code>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-xs text-gray-800">REACT_APP_AWS_REGION=us-east-1</code>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-xs text-gray-800">REACT_APP_LAMBDA_ORCHESTRATOR_URL=https://api.gateway.url</code>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">3. Bedrock Model Access</h4>
                <p className="text-xs text-gray-600">Enable model access in AWS Bedrock console for Claude, Titan, and other foundation models</p>
              </div>
            </div>
          </div>

          {/* Architecture Diagram Reference */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Architecture Reference</h3>
            <div className="text-sm text-amber-800 space-y-1">
              <p>📋 <strong>VPC Setup:</strong> Multi-AZ with public/private subnets, NAT gateways</p>
              <p>🔒 <strong>Security:</strong> WAF, KMS encryption, VPC endpoints, security groups</p>
              <p>🤖 <strong>AI Agents:</strong> 8 specialized Bedrock agents with Lambda orchestration</p>
              <p>💾 <strong>Data Storage:</strong> DocumentDB cluster, S3, OpenSearch for vector search</p>
              <p>📊 <strong>Monitoring:</strong> CloudWatch dashboards, SNS alerts, performance metrics</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Building with AWS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}