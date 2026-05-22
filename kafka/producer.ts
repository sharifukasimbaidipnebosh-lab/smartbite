import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "smartbite",
  brokers: [
    process.env.KAFKA_BROKER!,
  ],
});

export const producer =
  kafka.producer();