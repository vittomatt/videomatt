# Prerequisites

You need `Docker`and `terraform` to run this project

# Structure

![Videomatt Architecture](videomatt.jpg)

# To run the project with docker

- Copy `.env.example` as `.env`
- Run: `make run-all`

# To run the project locally

- Install dependencies `npm ci`
- Copy `.env.example` as `.env`
- Run: `docker compose up redis db-users db-videos`
- Run `npm run dev:users`
- Run `npm run dev:videos`

## Create the infrastructure

### Terraform

- Install the client and go to folder
- `cd terraform`

#### LocalStack

```
unset AWS_PROFILE
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

terraform -chdir=terraform init -backend=false
terraform -chdir=terraform plan -var-file=local.tfvars
terraform -chdir=terraform apply -var-file=local.tfvars -auto-approve
```

#### AWS

```
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
export AWS_PROFILE=videomatt-local

terraform -chdir=terraform init -backend=false
terraform -chdir=terraform plan -var-file=aws.tfvars
terraform -chdir=terraform apply -var-file=aws.tfvars
```

### Script

#### Create SQS

```
aws sqs create-queue \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--queue-name videomatt_users_1_event_user_created_dlq
```

```
aws sqs create-queue \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--queue-name videomatt_users_1_event_user_created_retry \
--attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created_dlq\",\"maxReceiveCount\":\"3\"}"}'
```

```
aws sqs create-queue \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--queue-name videomatt_users_1_event_user_created \
--attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created_retry\",\"maxReceiveCount\":\"1\"}"}'
```

```
aws sqs create-queue \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--queue-name videomatt_videos_1_event_video_created_dlq
```

```
aws sqs create-queue \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--queue-name videomatt_videos_1_event_video_created_retry \
--attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created_dlq\",\"maxReceiveCount\":\"3\"}"}'
```

```
aws sqs create-queue \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--queue-name videomatt_videos_1_event_video_created \
--attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created_retry\",\"maxReceiveCount\":\"1\"}"}'
```

#### Create SNS topics

```
aws sns create-topic \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--name videomatt_videos \
--output text \
--query 'TopicArn'
```

#### Create subscription

```
aws sns subscribe \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--topic-arn arn:aws:sns:us-east-1:000000000000:videomatt_videos \
--protocol sqs \
--notification-endpoint arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created \
--attributes '{"FilterPolicy":"{\"EventType\":[\"videomatt.videos.1.event.video.created\"]}"}'
```

#### Create the event bridge rules

```
aws events put-rule \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--name videomatt_users \
--event-bus-name default \
--event-pattern '{"detail": {"name": ["videomatt.users.1.event.user.created"]}}'
```

#### Create policy

```
aws sqs set-queue-attributes \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--queue-url http://localhost:4566/000000000000/videomatt_users_1_event_user_created \
--attributes '{"Policy":"{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"AllowEventBridgeSendMessage\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"events.amazonaws.com\"},\"Action\":\"sqs:SendMessage\",\"Resource\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created\",\"Condition\":{\"ArnEquals\":{\"aws:SourceArn\":\"arn:aws:events:us-east-1:000000000000:rule/videomatt_users\"}}}]}"}'
```

```
aws sqs set-queue-attributes \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--queue-url http://localhost:4566/000000000000/videomatt_videos_1_event_video_created \
--attributes '{"Policy":"{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"AllowEventBridgeSendMessage\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"sns.amazonaws.com\"},\"Action\":\"sqs:SendMessage\",\"Resource\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created\",\"Condition\":{\"ArnEquals\":{\"aws:SourceArn\":\"arn:aws:sns:us-east-1:000000000000:videomatt_videos\"}}}]}"}'
```

#### Create the event bridge targets

```
aws events put-targets \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--event-bus-name default \
--rule videomatt_users \
--targets Id=UserCreatedTarget,Arn=arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created
```

#### Send messages

##### Create user

```
aws events put-events \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --entries '[
    {
      "Source": "videomatt.user",
      "DetailType": "user.created",
      "Detail": "{\"id\": \"550e8400-e29b-41d4-a716-446655440000\", \"firstName\": \"Vitto\", \"lastName\": \"Matt\", \"name\": \"videomatt.users.1.event.user.created\"}",
      "EventBusName": "default"
    }
  ]'
```

##### Create video

```
aws sns publish \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --topic-arn arn:aws:sns:us-east-1:000000000000:videomatt_videos \
  --message '{"id": "150e8400-e29b-41d4-a716-446655440001", "title": "First Video", "userId": "550e8400-e29b-41d4-a716-446655440000"}' \
  --message-attributes '{
    "EventType": {
      "DataType": "String",
      "StringValue": "videomatt.videos.1.event.video.created"
    }
  }'
```
