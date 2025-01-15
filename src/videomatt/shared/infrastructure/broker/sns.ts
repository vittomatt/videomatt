import AWS from 'aws-sdk';

const sns = new AWS.SNS({ region: process.env.AWS_REGION || 'us-east-1' });

export const sendSnsMessage = async (topicArn: string, message: string) => {
    try {
        const params: AWS.SNS.PublishInput = {
            TopicArn: topicArn,
            Message: message,
            MessageAttributes: {
                entity: {
                    DataType: 'String',
                    StringValue: 'codelyty_video_1_event_video_published',
                },
            },
        };

        const result = await sns.publish(params).promise();
        console.log('Mensaje enviado:', result.MessageId);
        return result;
    } catch (error) {
        console.error('Error enviando mensaje a SNS:', error);
        throw error;
    }
};

/*
app.post('/send', async (req: Request, res: Response) => {
    const { topicArn, message } = req.body;

    if (!topicArn || !message) {
        res.status(400).json({
            error: 'Faltan topicArn o message en el cuerpo de la solicitud.',
        });
    }

    try {
        const result = await sendSnsMessage(topicArn, message);
        res.status(200).json({ messageId: result.MessageId });
    } catch (error) {
        res.status(500).json({ error: 'Error enviando mensaje a SNS', details: error });
    }
});
*/
