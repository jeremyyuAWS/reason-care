# Amazon Bedrock Configuration for AI Agents
# Based on the architecture diagram showing multiple specialized agents

# Bedrock Model Access
data "aws_bedrock_foundation_models" "available" {
  by_provider = "anthropic"
}

# IAM Role for Bedrock Access
resource "aws_iam_role" "bedrock_execution_role" {
  name = "${var.app_name}-bedrock-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "ecs-tasks.amazonaws.com",
            "lambda.amazonaws.com"
          ]
        }
      }
    ]
  })

  tags = {
    Name        = "${var.app_name}-bedrock-role"
    Environment = var.environment
  }
}

# IAM Policy for Bedrock Access
resource "aws_iam_role_policy" "bedrock_policy" {
  name = "${var.app_name}-bedrock-policy"
  role = aws_iam_role.bedrock_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:ListFoundationModels",
          "bedrock:GetFoundationModel"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "transcribe:StartTranscriptionJob",
          "transcribe:GetTranscriptionJob",
          "transcribe:StartStreamTranscription"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Knowledge Base for Medical Guidelines (Vector Database)
resource "aws_bedrockagent_knowledge_base" "medical_guidelines" {
  name     = "${var.app_name}-medical-guidelines"
  role_arn = aws_iam_role.bedrock_knowledge_base_role.arn

  knowledge_base_configuration {
    vector_knowledge_base_configuration {
      embedding_model_arn = "arn:aws:bedrock:${var.aws_region}::foundation-model/amazon.titan-embed-text-v1"
    }
    type = "VECTOR"
  }

  storage_configuration {
    type = "OPENSEARCH_SERVERLESS"
    opensearch_serverless_configuration {
      collection_arn    = aws_opensearchserverless_collection.knowledge_base.arn
      vector_index_name = "medical-guidelines-index"
      field_mapping {
        vector_field   = "vector"
        text_field     = "text"
        metadata_field = "metadata"
      }
    }
  }

  tags = {
    Name        = "${var.app_name}-knowledge-base"
    Environment = var.environment
  }
}

# OpenSearch Serverless Collection for Vector Database
resource "aws_opensearchserverless_collection" "knowledge_base" {
  name = "${var.app_name}-knowledge-base"
  type = "VECTORSEARCH"

  tags = {
    Name        = "${var.app_name}-opensearch-collection"
    Environment = var.environment
  }
}

# IAM Role for Knowledge Base
resource "aws_iam_role" "bedrock_knowledge_base_role" {
  name = "${var.app_name}-bedrock-kb-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "bedrock.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.app_name}-bedrock-kb-role"
    Environment = var.environment
  }
}

# CloudWatch Dashboard for AI Agents Monitoring
resource "aws_cloudwatch_dashboard" "ai_agents" {
  dashboard_name = "${var.app_name}-ai-agents"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Bedrock", "Invocations", "ModelId", "anthropic.claude-3-sonnet-20240229-v1:0"],
            ["AWS/Bedrock", "InputTokens", "ModelId", "anthropic.claude-3-sonnet-20240229-v1:0"],
            ["AWS/Bedrock", "OutputTokens", "ModelId", "anthropic.claude-3-sonnet-20240229-v1:0"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Bedrock Model Invocations"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Transcribe", "TranscriptionJobs", "ServiceType", "standard"],
            ["AWS/Transcribe", "AudioDurationSeconds", "ServiceType", "standard"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Voice Processing Metrics"
          period  = 300
        }
      }
    ]
  })
}

# Lambda Function for AI Agent Orchestration
resource "aws_lambda_function" "agent_orchestrator" {
  filename         = "agent_orchestrator.zip"
  function_name    = "${var.app_name}-agent-orchestrator"
  role            = aws_iam_role.bedrock_execution_role.arn
  handler         = "index.handler"
  source_code_hash = data.archive_file.agent_orchestrator.output_base64sha256
  runtime         = "python3.11"
  timeout         = 300

  environment {
    variables = {
      BEDROCK_REGION = var.aws_region
      KNOWLEDGE_BASE_ID = aws_bedrockagent_knowledge_base.medical_guidelines.id
      DOCDB_ENDPOINT = aws_docdb_cluster.main.endpoint
    }
  }

  tags = {
    Name        = "${var.app_name}-agent-orchestrator"
    Environment = var.environment
  }
}

# Archive file for Lambda function
data "archive_file" "agent_orchestrator" {
  type        = "zip"
  output_path = "agent_orchestrator.zip"
  source {
    content = templatefile("${path.module}/lambda/agent_orchestrator.py", {
      app_name = var.app_name
    })
    filename = "index.py"
  }
}

# API Gateway for Agent Orchestration
resource "aws_api_gateway_rest_api" "agents" {
  name        = "${var.app_name}-agents-api"
  description = "API for AI agent orchestration"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name        = "${var.app_name}-agents-api"
    Environment = var.environment
  }
}

# Outputs for Bedrock resources
output "bedrock_execution_role_arn" {
  description = "ARN of the Bedrock execution role"
  value       = aws_iam_role.bedrock_execution_role.arn
}

output "knowledge_base_id" {
  description = "ID of the Bedrock knowledge base"
  value       = aws_bedrockagent_knowledge_base.medical_guidelines.id
}

output "agent_orchestrator_function_name" {
  description = "Name of the agent orchestrator Lambda function"
  value       = aws_lambda_function.agent_orchestrator.function_name
}