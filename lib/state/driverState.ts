import { redis } from "../redis";

export async function saveDriver(driverId: string, data: any) {
  await redis.hset(`driver:${driverId}`, data);
}

export async function getAllDrivers() {
  const keys = await redis.keys("driver:*");

  const drivers = await Promise.all(
    keys.map(async (key) => {
      return await redis.hgetall(key);
    })
  );

  return drivers;
}