import { v2 as cloudinary } from "cloudinary"
import Product from "../models/product.js";

// Add product - api/product/add

export const addProduct = async(req,res)=>{

    try {
        
        let productData=JSON.parse(req.body.productData);

        const images=req.files

        // console.log(images);
        
        let imagesUrl=await Promise.all(images.map(async(item)=>{
            let result = await cloudinary.uploader.upload(item.path,{
                resource_type:"image"
            });
            // console.log(result.secure_url);

            return result.secure_url;
        }))

        await Product.create({...productData, image:imagesUrl});

        res.json({success:true,message:"Product added successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }

}

// get product - api/product/list
export const productList = async(req,res)=>{
    try {
        const products = await Product.find({});
        res.json({success:true, product:products});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// single product - api/product/:id
export const productById = async(req,res)=>{
    try {
        const {id} =req.params
        const product =await Product.findById(id);
        res.json({success:true, data:product});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// prouct instock-api/product/stock
export const chngStock = async(req,res)=>{
    try {
        const{id,inStock} = req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        res.json({success:true,message:"Stock updated"});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}