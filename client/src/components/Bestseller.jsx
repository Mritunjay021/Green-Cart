import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/Appcontext'

const Bestseller = () => {
    const { product } = useAppContext();

    if (!product || product.length === 0) return <p>Loading...</p>;

    return (
        <div className='mt-16'>
            <p className='text-2xl md:text-3xl font-medium'>BestSeller</p>
            <div className='mt-10'>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                    {product.filter((prod)=>prod.inStock).slice(0,5).map((prod,index)=>(<ProductCard key={index} product={prod} />))}
                </div>
            </div>
        </div>
    )
}

export default Bestseller
