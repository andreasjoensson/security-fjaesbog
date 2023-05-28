const redis = require("redis");
require("dotenv").config(); // Load environment variables from .env file

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  },
});

(async () => {
  redisClient.on("error", (err) => console.log(err));
  await redisClient.connect();
})();

const getRedisAsync = async (key) => {
  const value = await redisClient.get(key);
  return value;
};
const setRedisAsync = async (key, value) => {
  await redisClient.set(key, value);
};

const onConnectCallback = (callback) => {
  redisClient.on("connect", () => {
    callback();
  });
};

module.exports = {
  getRedisAsync,
  setRedisAsync,
  onConnectCallback,
  redisClient,
};
