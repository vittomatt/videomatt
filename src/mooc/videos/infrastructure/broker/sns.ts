import AWS from "aws-sdk";

const sns = new AWS.SNS({ region: process.env.AWS_REGION || "us-east-1" });

export const sendSnsMessage = async (topicArn: string, message: string) => {
  try {
    const params: AWS.SNS.PublishInput = {
      TopicArn: topicArn,
      Message: message,
      MessageAttributes: {
        entity: {
          DataType: "String",
          StringValue: "codelyty_video_1_event_video_published",
        },
      },
    };

    const result = await sns.publish(params).promise();
    console.log("Mensaje enviado:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error enviando mensaje a SNS:", error);
    throw error;
  }
};
