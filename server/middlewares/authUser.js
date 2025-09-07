import jwt from "jsonwebtoken"

const authuser = async (req,res,next)=>
{
    const {token} =req.cookies;

    if(!token)
        return  res.json({success:false,message:"No token provided"});

    try{
        const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);

        if(!decodedtoken?.id)
            return res.json({success:false,message:"Invalid token"});
        
        req.userId = decodedtoken.id;

        next();
    }
    catch(err)
    {
        return res.json({success:false,message:err.message});
    }
}

export default authuser;