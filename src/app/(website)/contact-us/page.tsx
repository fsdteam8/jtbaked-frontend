import FooterBannar from '@/components/footerBannar'
import BannerSection from '@/components/homeHeaders/BannerSection'
import React from 'react'

const page = () => {
  return (
    <div>
      <BannerSection image='/password.jpg' title='Contact Us' description="Here are the products you've saved. You can remove items or contact us to learn more." />
      <div className='container mx-auto'>
        <FooterBannar />
      </div>
    </div>
  )
}

export default page