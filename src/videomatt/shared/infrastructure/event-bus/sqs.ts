import AWS from 'aws-sdk';

const sqs = new AWS.SQS({ region: process.env.AWS_REGION || 'us-east-1' });

// fitu use this?
export async function receiveMessages(queueUrl: string) {
    try {
        const params: AWS.SQS.ReceiveMessageRequest = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5,
        };

        const response = await sqs.receiveMessage(params).promise();

        if (!response.Messages || response.Messages.length === 0) {
            console.log('No hay mensajes en la cola.');
            return [];
        }

        for (const message of response.Messages) {
            console.log('Queue URL:', queueUrl);
            console.log('Mensaje recibido:', message.Body);

            if (message.ReceiptHandle) {
                await deleteMessage(queueUrl, message.ReceiptHandle);
            }
        }

        return response.Messages;
    } catch (error) {
        console.error('Error leyendo mensajes de SQS:', error);
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
        console.log('Mensaje eliminado:', receiptHandle);
    } catch (error) {
        console.error('Error eliminando mensaje de SQS:', error);
    }
}

/*
app.get('/read-messages', async (req: Request, res: Response) => {
    try {
        const queuePublished1 =
            'https://sqs.us-east-1.amazonaws.com/257201716142/codelyty_video_1_event_video_published';
        const queueUpdated1 = 'https://sqs.us-east-1.amazonaws.com/257201716142/codelyty_video_1_event_video_updated';
        const queuePublished2 =
            'https://sqs.us-east-1.amazonaws.com/257201716142/codelyty_video_2_event_video_published';

        await receiveMessages(queuePublished1);
        await receiveMessages(queueUpdated1);
        await receiveMessages(queuePublished2);

        res.status(200).json({ done: true });
    } catch (error) {
        res.status(500).json({ error: 'Error leyendo mensajes de SQS', details: error });
    }
});
*/
