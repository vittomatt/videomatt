To run the project

- Copy `.env` to root folder
- Run: `docker compose up`

Create SQS

- aws sqs \
   --endpoint-url http://localhost:4566 \
   --region us-east-1 \
   create-queue \
   --queue-name videomatt_users_1_event_user_created_dlq
- aws sqs \
   --endpoint-url http://localhost:4566 \
   --region us-east-1 \
   create-queue \
   --queue-name videomatt_users_1_event_user_created_retry \
   --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created_dlq\",\"maxReceiveCount\":\"3\"}"}'
- aws sqs \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  create-queue \
  --queue-name videomatt_users_1_event_user_created \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created_retry\",\"maxReceiveCount\":\"1\"}"}'

- aws sqs \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  create-queue \
  --queue-name videomatt_videos_1_event_video_created_dlq
- aws sqs \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  create-queue \
  --queue-name videomatt_videos_1_event_video_created_retry \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created_dlq\",\"maxReceiveCount\":\"3\"}"}'
- aws sqs \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  create-queue \
  --queue-name videomatt_videos_1_event_video_created \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created_retry\",\"maxReceiveCount\":\"1\"}"}'

Create SNS topics

- aws sns \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  create-topic \
  --name videomatt_videos \
  --output text \
  --query 'TopicArn'
- aws sns \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  create-topic \
  --name videomatt_users \
  --output text \
  --query 'TopicArn'

Create subscription

- aws sns \
  --endpoint-url http://localhost:4566 --region us-east-1 \
   subscribe \
   --topic-arn arn:aws:sns:us-east-1:000000000000:videomatt_users \
   --protocol sqs \
   --notification-endpoint arn:aws:sqs:us-east-1:000000000000:videomatt_users_1_event_user_created \
   --attributes '{"FilterPolicy":"{\"EventType\":[\"videomatt.user.1.event.user.created\"]}"}'
- aws sns \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  subscribe \
  --topic-arn arn:aws:sns:us-east-1:000000000000:videomatt_videos \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:us-east-1:000000000000:videomatt_videos_1_event_video_created \
  --attributes '{"FilterPolicy":"{\"EventType\":[\"videomatt.videos.1.event.video.created\"]}"}'
