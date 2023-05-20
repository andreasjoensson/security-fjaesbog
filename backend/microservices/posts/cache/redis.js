const redis = require("redis");
require("dotenv").config(); // Load environment variables from .env file

const redisClient = redis.createClient({
  password: "ryKmjWL30ZWF2VeI9MiNpF7hBTZrmzw7",
  socket: {
    host: "redis-16972.c263.us-east-1-2.ec2.cloud.redislabs.com",
    port: 16972,
  },
});

(async () => {
  redisClient.on("error", (err) => console.log(err));
  await redisClient.connect();
})();

const getRedisAsync = async (key) => {
  console.log("yeeeeeee");
  const value = await redisClient.get(key);
  console.log("value", value);
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
