const { getRedisAsync, setRedisAsync } = require("./redis");

function cacheMiddleware(resolverFunction) {
  return async (parent, args, context, info) => {
    const cacheKey = `${info.fieldName}:${JSON.stringify(args)}`;

    // Try to fetch data from cache
    const cachedData = await getFromCache(cacheKey);

    if (cachedData) {
      console.log("Data retrieved from cache", cachedData);
      const parsedData = JSON.parse(cachedData);
      return parsedData;
    }

    // If data is not available in cache, call the original resolver function
    const result = await resolverFunction(parent, args, context, info);

    // Save the result to cache
    await saveToCache(cacheKey, result);

    return result;
  };
}

// Helper function to fetch data from Redis cache
async function getFromCache(key) {
  return await getRedisAsync(key);
}

// Helper function to save data to Redis cache
async function saveToCache(key, data) {
  const serializedData = JSON.stringify(data);
  return setRedisAsync(key, serializedData);
}

module.exports = cacheMiddleware;
