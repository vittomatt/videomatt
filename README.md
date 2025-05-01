# To run the project

- Install dependencies `npm ci`
- Copy `.env.example` as `.env` or `.env.docker.example` as `.env.docker`
- Run: `docker compose up`

# Create SQS

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

# Create SNS topics

```
aws sns create-topic \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--name videomatt_videos \
--output text \
--query 'TopicArn'
```

# Create subscription

```
aws sns subscribe \
--endpoint-url http://localhost:4566 \
--region us-east-1 \
--topic-arn arn:aws:sns:us-east-1:000000000000:videomatt_videos \
--protocol sqs \
--notification-endpoint arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created \
--attributes '{"FilterPolicy":"{\"EventType\":[\"videomatt.videos.1.event.video.created\"]}"}'
```

# Create the event bridge rules

```
aws events put-rule \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--name videomatt-users \
--event-bus-name default \
--event-pattern '{"detail": {"name": ["videomatt.users.1.event.user.created"]}}'
```

# Create policy

```
aws sqs set-queue-attributes \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--queue-url http://localhost:4566/000000000000/videomatt_users_1_event_user_created \
--attributes '{"Policy":"{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"AllowEventBridgeSendMessage\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"events.amazonaws.com\"},\"Action\":\"sqs:SendMessage\",\"Resource\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created\",\"Condition\":{\"ArnEquals\":{\"aws:SourceArn\":\"arn:aws:events:us-east-1:000000000000:rule/videomatt-users\"}}}]}"}'
```

# Create the event bridge targets

```
aws events put-targets \
--endpoint-url=http://localhost:4566 \
--region us-east-1 \
--event-bus-name default \
--rule videomatt-users \
--targets Id=UserCreatedTarget,Arn=arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created
```
