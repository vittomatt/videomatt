variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "local | prod"
  type        = string
}

variable "use_localstack" {
  description = "Local or AWS"
  type        = bool
  default     = false
}

variable "localstack_endpoints" {
  description = "Localstack map"
  type        = map(string)
  default = {
    sqs    = "http://localhost:4566"
    sns    = "http://localhost:4566"
    events = "http://localhost:4566"
    iam    = "http://localhost:4566"
    sts    = "http://localhost:4566"
  }
}
