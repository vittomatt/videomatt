terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region

  access_key = var.use_localstack ? "test"      : null
  secret_key = var.use_localstack ? "test"      : null
  profile    = var.use_localstack ? null        : "videomatt"

  skip_credentials_validation = var.use_localstack
  skip_requesting_account_id  = var.use_localstack
  s3_use_path_style           = var.use_localstack

  endpoints {
    sqs    = var.use_localstack ? "http://localhost:4566" : ""
    sns    = var.use_localstack ? "http://localhost:4566" : ""
    events = var.use_localstack ? "http://localhost:4566" : ""
    iam    = var.use_localstack ? "http://localhost:4566" : ""
    sts    = var.use_localstack ? "http://localhost:4566" : ""
  }
}
