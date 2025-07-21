import jwt from "jwt";

export default function generateToken(userId,roleId,res){

  try{
    const JWT_SECRET=process.env.JWT_SECRET;
    const accessToken = jwt.sign({id:userId,roleId:roleId},JWT_SECRET,{expiresIn:15*60});
    const refreshToken = jwt.sign({id:userId,roleId:roleId},JWT_SECRET,{expiresIn:"15d"});

    res.cookie(
        "token",refreshToken,
        {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.ENVIRONMENT==="PRODUCTION",
            maxAge:15*24*60*60*1000
        }
    );
    return accessToken;
  }
  catch(err){
    throw  err;
  }


}