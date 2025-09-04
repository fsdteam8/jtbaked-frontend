import React from 'react'
import FavoritesPage from './_components/addFavorites'
import BannerSection from '@/components/homeHeaders/BannerSection'

const page = () => {
    return (
        <div>
            <BannerSection image='/pexels.jpg'  title='My Favorites' description="Here are the products you've saved. You can remove items or contact us to learn more." />
            <FavoritesPage />
        </div>
    )
}

export default page