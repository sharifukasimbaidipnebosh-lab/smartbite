import Redis from "ioredis";

export const publisher = new Redis({
  host: process.env.REDIS_HOST,
});

export const subscriber = new Redis({
  host: process.env.REDIS_HOST,
});

// 📡 Publish event
export function publishEvent(
  channel: string,
  data: any
) {
  publisher.publish(
    channel,
    JSON.stringify(data)
  );
}