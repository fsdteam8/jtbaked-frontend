import React from 'react'
import ProductsPage from './_components/ProductsPage'
import BannerSection from '@/components/homeHeaders/BannerSection'

const page = () => {
    return (
        <div>
            <div className='mb-10'>
            <BannerSection title='Browse Our All Products' image='/pexels1.jpg' description={"High-quality products for every need – Indoor & Outdoor High-quality products for every"}/>
            </div>
            <ProductsPage />
        </div>
    )
}

export default page