import jwt from "jsonwebtoken";

// Register:/api/seller/login

export const login = async(req,res) =>{

    try
    {
        const {email,password} = req.body;

        if(process.env.SELLER_EMAIL === email && process.env.SELLER_PASSWORD === password )
        {
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'})

            res.cookie('token',token,{
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                samesite:process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge:7*24*60*60*1000
            })

            return res.json({success:true,message:"LoggedIn"})
        }
        else
        {
            return res.json({success:false,message:"Invalid Credentials"})
        }
    }
    catch(err)
    {
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}


//Register : api/seller/isauth

export const isauth = async (req, res) => {
    try {
        return res.json({ success: true});
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};


//Register : api/seller/logout

export const logout = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            samesite:process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        return res.json({success:true,message:"Logged Out Successfully"})
    }
    catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message});
    }
}