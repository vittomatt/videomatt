import AWS from "aws-sdk";

const sqs = new AWS.SQS({ region: process.env.AWS_REGION || "us-east-1" });

export async function receiveMessages(queueUrl: string) {
  try {
    const params: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
    };

    const response = await sqs.receiveMessage(params).promise();

    if (!response.Messages || response.Messages.length === 0) {
      console.log("No hay mensajes en la cola.");
      return [];
    }

    for (const message of response.Messages) {
      console.log("Queue URL:", queueUrl);
      console.log("Mensaje recibido:", message.Body);

      if (message.ReceiptHandle) {
        await deleteMessage(queueUrl, message.ReceiptHandle);
      }
    }

    return response.Messages;
  } catch (error) {
    console.error("Error leyendo mensajes de SQS:", error);
    throw error;
  }
}

async function deleteMessage(queueUrl: string, receiptHandle: string) {
  try {
    const params: AWS.SQS.DeleteMessageRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    await sqs.deleteMessage(params).promise();
    console.log("Mensaje eliminado:", receiptHandle);
  } catch (error) {
    console.error("Error eliminando mensaje de SQS:", error);
  }
}
