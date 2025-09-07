import jwt from 'jsonwebtoken'

const authSeller = async(req,res,next)=>{
    const {token} =req.cookies;

    if(!token)
        return res.json({success:false,message:"No token provided"});

    try {
        const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);

        if(decodedtoken.email === process.env.SELLER_EMAIL)
            next();
        else
            return res.json({success:false,message:"Invalid email"})
    } 
    catch (error) {
        console.log(error.message)
        return res.json({success:false,message:error.message})
    }
}

export default authSeller