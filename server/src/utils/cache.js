import redisClient from "../config/redis.js";

export const setCache = async (
  key,
  value,
  ttl = 3600
) => {
  await redisClient.setEx(
    key,
    ttl,
    JSON.stringify(value)
  );
};

export const getCache = async (
  key
) => {
  const data =
    await redisClient.get(key);

  return data
    ? JSON.parse(data)
    : null;
};

export const deleteCache = async (
  key
) => {
  await redisClient.del(key);
};