import rateLimit from "express-rate-limit";

const basicLimiter = rateLimit({
    windowMs: 15*60*1000, //15mnts
    max: 100,  //limit each ip to 100 requests
    message:  'Too many requests from this IP, try again later.',
});

export default basicLimiter;