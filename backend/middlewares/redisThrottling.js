import redisClient from "../config/redis";

const throttleAction = async(req,res,next) => {
    const identifier=req.ip; //or req.user.id/email

    const throttleKey=`throttle:${identifier}`;

    const isThrottled=await redisClient.exists(throttleKey);
    if(isThrottled){
        return res.status(429).json({message:"Please wait before trying"});
    }

    //set throttle key with expiry of 5s
    await redisClient.setEx(throttleKey,5,'1');

    next();
}

export default throttleAction;