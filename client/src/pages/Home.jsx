import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import Bestseller from '../components/Bestseller'
import Bottombanner from '../components/Bottombanner'
import Newsletter from '../components/Newsletter'
import AssistantChat from '../components/AssistantChat'

const Home = () => {
  return (
    <div className='mt-10 '>
      <MainBanner />
      <Categories />
      <Bestseller />
      <Bottombanner />
      <Newsletter />
      <AssistantChat />
    </div>
  )
}

export default Home
