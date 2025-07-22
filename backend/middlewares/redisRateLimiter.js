import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis"
import redisClient from "../config/redis";


const redisLimiter = rateLimit({
    windowMs:60*1000,   //one minute
    max: 5,  //limit each ip to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests,please try again later",
    store: new RedisStore({
        sendCommand: (...args)=> redisClient.sendCommand(args),
    }),
});

export default redisLimiter;