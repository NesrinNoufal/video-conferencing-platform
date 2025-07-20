import mongoose from "mongoose"
import bcrypt from "bcrypt"


export const signup  =  async(req,res) => {
    try{
     const {name,email,password}=req.body;
     
     const response={
        status: true,
        message:"signup successfull"
     }
     return res.status(200).json(response);

    }
    catch(err){
        const response={
            status: false,
            message:"Login failed",
            error:err.message || err
        }
        return res.status(500).json(response);
    }     
}

export const login =  async(req,res) => {
    try{
     const {email,password}=req.body;
     
     const user = await  prisma.user.findUnique({
        where:{
            email:email
        }
     })
     if(!user){
         const response={
            status:false,
            message:"User not found"
        }
        return res.status(420).json(response);
     }
    
     const isMatch= await bcrypt.compare(password,user.password)
     if(!isMatch){
          const response={
            status:false,
            message:"Invalid credentials"
        }
        return res.status(420).json(response);
     }

     const accessToken= jwt.sign({id:user.id,role:"admin"},process.env.JWT_SECRET,{expiresIn:'15mnt'})
     const refreshToken= jwt.sign({id:user.id,role:"admin"},process.env.JWT_SECRET,{expiresIn:'15d'})

     res.cookie("authToken",refreshToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge: 15*24*60*60*1000,
        secure:true
     });

     const response={
        status: true,
        message:"Login successfull",
        token:accessToken
     }
     return res.status(200).json(response);

    }
    catch(err){
        const response={
            status: false,
            message:"Login failed",
            error:err.message || err
        }
        return res.status(500).json(response);
    }

}

export const logout=async(req,res) => {
    
}

