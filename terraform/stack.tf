###############################################################################
#  SQS – Users
###############################################################################

resource "aws_sqs_queue" "users_dlq" {
  name     = "videomatt_users_1_event_user_created_dlq"
}

resource "aws_sqs_queue" "users_retry" {
  name     = "videomatt_users_1_event_user_created_retry"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.users_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "users_main" {
  name     = "videomatt_users_1_event_user_created"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.users_retry.arn
    maxReceiveCount     = 1
  })
}

###############################################################################
#  SQS – Videos
###############################################################################

resource "aws_sqs_queue" "videos_dlq" {
  name     = "videomatt_videos_1_event_video_created_dlq"
}

resource "aws_sqs_queue" "videos_retry" {
  name     = "videomatt_videos_1_event_video_created_retry"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.videos_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "videos_main" {
  name     = "videomatt_videos_1_event_video_created"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.videos_retry.arn
    maxReceiveCount     = 1
  })
}

###############################################################################
#  SNS
###############################################################################

resource "aws_sns_topic" "videos" {
  name     = "videomatt_videos"
}

resource "aws_sns_topic_subscription" "videos_created_sub" {
  provider       = aws
  topic_arn      = aws_sns_topic.videos.arn
  protocol       = "sqs"
  endpoint       = aws_sqs_queue.videos_main.arn
  filter_policy  = jsonencode({
    EventType = ["videomatt.videos.1.event.video.created"]
  })
}

###############################################################################
#  EventBridge – rule + target
###############################################################################

resource "aws_cloudwatch_event_rule" "users_rule" {
  provider       = aws
  name           = "videomatt_users"
  event_bus_name = "default"

  event_pattern = jsonencode({
    detail = {
      name = ["videomatt.users.1.event.user.created"]
    }
  })
}

resource "aws_cloudwatch_event_target" "users_target" {
  provider  = aws
  rule      = aws_cloudwatch_event_rule.users_rule.name
  target_id = "UserCreatedTarget"
  arn       = aws_sqs_queue.users_main.arn
}

###############################################################################
#  Queue access policy
###############################################################################

data "aws_iam_policy_document" "users_queue_policy" {
  statement {
    sid     = "AllowEventBridgeSendMessage"
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.users_main.arn]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudwatch_event_rule.users_rule.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "users_main_policy" {
  provider  = aws
  queue_url = aws_sqs_queue.users_main.id
  policy    = data.aws_iam_policy_document.users_queue_policy.json
}

data "aws_iam_policy_document" "videos_queue_policy" {
  statement {
    sid     = "AllowSNSPublish"
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.videos_main.arn]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_sns_topic.videos.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "videos_main_policy" {
  provider  = aws
  queue_url = aws_sqs_queue.videos_main.id
  policy    = data.aws_iam_policy_document.videos_queue_policy.json
}
