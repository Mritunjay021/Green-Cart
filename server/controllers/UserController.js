import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authuser from "../middlewares/authUser.js";

// Register: user/api/register

export const register = async(req,res)=>{
    try {

        const {email,password,name} = req.body;

        if(!email || !name || !password)
            return res.json({success:false,message:"Missing Details"})

        const existingUser = await User.findOne({email})

        if(existingUser)
            return res.json({success:false,message:"User Already Exists"})

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({name,email,password:hashedPassword})

        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        return res.json({success:true,user:{email:user.email,name:user.name}})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message})
    }
}


// Register: api/user/login

export const login = async(req,res)=>{
    try {
        
        const {email,password} = req.body;

        if(!email || !password)
            return res.json({success:false,message:"Missing Details"})

        const user=await User.findOne({email})

        if(!user)
            return res.json({success:false,message:"User Not Found"})

        const ismatch=await bcrypt.compare(password,user.password)

        if(!ismatch)
            return res.json({success:false,message:"Invalid Credentials"})

        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        return res.json({success:true,message:"Shop" ,user:{email:user.email,name:user.name,password:user.password}})        

    } catch (error) {

        console.log(error.message);
        return res.json({success:false,message:error.message})
        
    }
}

//Register : api/user/isauth

export const isauth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.json({ success: false, message: "User not found" });

        return res.json({ success: true, user });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

//Register : api/user/logout

export const logout = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            samesite:process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        return res.json({success:true,message:"Logged Out"})
    }
    catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message});
    }
}