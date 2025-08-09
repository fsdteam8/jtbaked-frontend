import React from 'react'
import { AboutSection } from './_components/AboutSection'
import BannerSection from '@/components/homeHeaders/BannerSection'

const page = () => {
  return (
    <div>
        <BannerSection image='/password.jpg' title='About us' description="Here are the products you've saved. You can remove items or contact us to learn more."/>
        <AboutSection/>
    </div>
  )
}

export default page