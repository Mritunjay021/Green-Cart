import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes,useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/Appcontext'
import Loginform from './components/Loginform'
import Product from './pages/Product'
import CategoryProduct from './pages/CategoryProduct'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/Seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Order from './pages/seller/Order'
import Loading from './components/Loading'




const App = () => {

  const isSellerPath=useLocation().pathname.includes("seller")
  const {showUserLogin,isSeller} = useAppContext(); 

  return (
    <div className='text-default min-h-screen text-gray-704 bg-white'>

      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Loginform /> : null}

      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"} `}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:category" element={<CategoryProduct />} />
            <Route path="/product/:category/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/addaddress" element={<AddAddress />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/loader" element={<Loading />} />
            <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />} >
              <Route index element={isSeller ? <AddProduct /> : null} />
              <Route path="productlist" element={isSeller ? <ProductList /> : null} />
              <Route path="orders" element={isSeller ? <Order /> : null} />

            </Route>

          </Routes>
        </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
