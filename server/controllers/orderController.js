import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/User.js";

// Register: api/order/cod

export const placeOrderCod = async(req,res)=>{
    try {
        const userId = req.userId;
        const {items,address} =req.body;

        if(!address ||  !items )
        {
            return res.json({success:false,message:"Invalid order details"})
        }

        let amount = await items.reduce(async(acc,item) =>{
            const product = await Product.findById(item.product);
            return (await acc) + (product.offerPrice * item.quantity);
        },0)

        amount += Math.floor(0.02 * amount);

       const order =  await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })

        return res.json({success:true,message:"Order placed successfully",order})

    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}



// Register: api/order/stripe

export const placeOrderStripe = async(req,res)=>{
    try {
        const userId = req.userId;
        const {items,address} =req.body;
        const {origin} = req.headers;

        if(!address ||  !items )
        {
            return res.json({success:false,message:"Invalid order details"})
        }

        let productData=[]

        let amount = await items.reduce(async(acc,item) =>{
            const product = await Product.findById(item.product);

            productData.push({
                name:product.name,
                price:product.price,
                quantity:item.quantity
            })

            return (await acc) + (product.offerPrice * item.quantity);
        },0)

        amount += Math.floor(0.02 * amount);

       const order =  await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        })

        // Stripe gateway initialize
        const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

        // create line for stripe 

        const line_items = productData.map((item) =>{
            return {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name
                    },
                    unit_amount:Math.floor(item.price + item.price * 0.02)*100
                },
                quantity:item.quantity
            }
        })

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url : `${origin}/loader?next=myorders`,
            cancel_url : `${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId
            }
        })

        return res.json({success:true,url:session.url,})

    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}

// Register: api/order/stripe

export const stripeWebhook = async(req,res)=>{

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.header['stripe-signature']

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
        
    } catch (error) {
        res.status(400).send(`Webhook error: ${error.message}`);
    }

    // handle the event
    switch(event.type){
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id;

            // Getting session metadata

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentId
            })

            const{orderId,userId} = session.data[0].metadata;

            // mark order as paid
            await Order.findByIdAndUpdate(orderId,{isPaid:true})

            await User.findByIdAndUpdate(userId,{cartItems:{}})

            break;
        }

        case 'payment_intent.payment_failed':{
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id;

            // Getting session metadata

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentId
            })

            const{orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    res.json({received:true})
}



// Register:api/order/user

export const getUserOrders = async(req,res)=>{
    try{
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or : [{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})

        console.log(req.userId);

        return res.json({success:true,orders})
    }
    catch(err){
        return res.json({success:false,message:err.message})
    }
}


// Register: api/order/seller

export const getAllOrders = async(req,res)=>{
    try{
        const orders = await Order.find({
            $or : [{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})

        return res.json({success:true,orders})
    }
    catch(err){
        return res.json({success:false,message:err.message})
    }
}