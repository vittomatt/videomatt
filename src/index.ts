import express, { Request, Response } from "express";
import { sendSnsMessage } from "./sns";
import { receiveMessages } from "./sqs";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/send", async (req: Request, res: Response) => {
  const { topicArn, message } = req.body;

  if (!topicArn || !message) {
    res.status(400).json({
      error: "Faltan topicArn o message en el cuerpo de la solicitud.",
    });
  }

  try {
    const result = await sendSnsMessage(topicArn, message);
    res.status(200).json({ messageId: result.MessageId });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error enviando mensaje a SNS", details: error });
  }
});

app.get("/read-messages", async (req: Request, res: Response) => {
  try {
    const queuePublished1 =
      "https://sqs.us-east-1.amazonaws.com/257201716142/codelyty_video_1_event_video_published";
    const queueUpdated1 =
      "https://sqs.us-east-1.amazonaws.com/257201716142/codelyty_video_1_event_video_updated";
    const queuePublished2 =
      "https://sqs.us-east-1.amazonaws.com/257201716142/codelyty_video_2_event_video_published";

    await receiveMessages(queuePublished1);
    await receiveMessages(queueUpdated1);
    await receiveMessages(queuePublished2);

    res.status(200).json({ done: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error leyendo mensajes de SQS", details: error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
