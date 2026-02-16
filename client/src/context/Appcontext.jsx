import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
// import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

export const Appcontext = createContext();

export const AppcontextProvider = ({ children }) => {

    const currency = "$";
    
    const navigate=useNavigate();
    const [User,setUser]=useState(false);
    const [isSeller,setisSeller]=useState(false);
    const [showUserLogin,setShowUserLogin]=useState(false);
    const [product,setProduct]=useState([]);

    const [cartItems,setCartItems]=useState({}); 
    const [searchQuery,setSearchQuery]=useState(""); 

    const fetchSeller = async()=>{
            try {
                const {data} = await axios.get('/api/seller/isauth')

            if(data.success){
                setisSeller(true);
            }
            else{
                setisSeller(false);
            }       
        } catch {
            setisSeller(false);
        }
    }

    // Fetch product
    const fetchProduct = async()=>{
        try {
            const {data} = await axios.get('/api/product/list')

            if(data.success){
                setProduct(data.product);
                // toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Fetch User

    const fetchUser = async()=>{
        try {
            const {data} = await axios.get('/api/user/isauth')

            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
        } catch {
            setUser(null);
            // toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchSeller();
        fetchProduct();
        fetchUser();
    }, []);

    useEffect(() =>{
        const syncCart = async()=>{
            try {
                const {data} = await axios.post('/api/cart/update',{cartItems})
                // console.log(data);

                if(!data.success){
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        if(User){
            syncCart();
        }
    },[cartItems])

    // add to cart
    const addtoCart=(itemId)=>{
        let cartdata=structuredClone(cartItems);

        if(cartdata[itemId]){
            cartdata[itemId] +=1;
        }
        else{
            cartdata[itemId]=1;
        }
        setCartItems(cartdata);
        toast.success("Item added to cart");
    }

    // update cart
    const updateCart = (itemId,quantity) =>{
        let cartdata=structuredClone(cartItems);
        cartdata[itemId]=quantity;
        setCartItems(cartdata);
        toast.success("Cart updated");
    }

    // remove from cart
    const removefromCart=(itemId)=>{
        let cartdata=structuredClone(cartItems);

        if(cartdata[itemId]){
            cartdata[itemId] -=1;
            if(cartdata[itemId]===0){
                delete cartdata[itemId];
            }
        }
        setCartItems(cartdata);
        toast.success("Item removed from cart");
    }

    // cart item count
    const getCartCount= () =>{
        let totalcount=0
        for(const item in cartItems){
            totalcount += cartItems[item];
        }
        return totalcount;
    }

    // cart total val
    const getCartAmount = ()=>{
        let totalamount=0;

        for(const item in cartItems){
            let iteminfo = product.find((prod)=> prod._id === item);
            totalamount += (iteminfo.offerPrice * cartItems[item]);
        }
        return Math.floor((totalamount*100)/100);
    }

    const value = {
        navigate,
        User,setUser,
        product,setProduct,
        isSeller,setisSeller,
        showUserLogin,setShowUserLogin,
        getCartCount,getCartAmount,
        currency,
        addtoCart,updateCart,removefromCart,cartItems,
        searchQuery,setSearchQuery,
        axios,
        fetchProduct,
        setCartItems,
    };

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    );
}

export const useAppContext = () =>{
    return useContext(Appcontext);
}