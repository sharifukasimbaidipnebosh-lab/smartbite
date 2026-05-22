import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "smartbite",
  brokers: [
    process.env.KAFKA_BROKER!,
  ],
});

export const producer =
  kafka.producer();

export async function sendEvent(
  topic: string,
  data: any
) {
  await producer.connect();

  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(data),
      },
    ],
  });
}