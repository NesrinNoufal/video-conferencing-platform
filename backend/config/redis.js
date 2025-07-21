import createClient from "redis"

const redisClient = createClient();

redisClient.on('error',(err)=>{
    console.error('Redis error',err);
});

redisClient.on('connect',(err)=>{
    console.log("Redis connected");
});

redisClient.connect();

export default redisClient;