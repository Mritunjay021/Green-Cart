import Address from "../models/address.js";

// Register: api/address/add
export const addAddress = async(req,res)=>{
    try {

        const userId = req.userId;
        const {address} = req.body;

        await(Address.create({ ...address,userId }))

        res.json({success:true,message:"Address added successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,error:error.message})
    }
}

// Register: api/address/get
export const getAddress = async(req,res)=>{
    try {
        const userId = req.userId;

        const addresses = await Address.find({userId});

        res.json({success:true, message:"Address fetched successfully",addresses})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,error:error.message})
    }
}