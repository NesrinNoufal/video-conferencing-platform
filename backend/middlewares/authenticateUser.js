import redisClient from "../config/redis";
import User from "../db/models/user";
import jwt from "jsonwebtoken"


const authMiddleware = async (req,res,next) => {
    const token = req.headers.authorization?.split('')[1];

    if(!token){
        return res.status(401).json({message:"unauthorized"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const userId = decoded.id;


        //check redis
        let user= redisClient.get(`user:${userId}`);
        if(user){
            req.user=user;
        }
        else{
            //if not in redis, fetch  from db and set it again.
            user=User.findById(user.id).select('-password');
            if(!user)  return res.status(401).json({message:"unauthorized"});

            await redisClient.setEx(`user:${user}`,3600,JSON.stringify(user));
            req.user=user;

            next();
        }
        
    }
    catch(err){
            res.status(401).json({ message: 'Invalid token', error: err.message });
        }
}

export default authMiddleware;