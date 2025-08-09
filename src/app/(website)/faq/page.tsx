import React from 'react'
import { FAQAccordion } from './_components/FAQAccordion'
import BannerSection from '@/components/homeHeaders/BannerSection'

const page = () => {
    return (
        <div>
            <BannerSection image='/account.jpg' title='Questions You Ask Us Often' description="Here are the products you've saved. You can remove items or contact us to learn more." />
            <FAQAccordion />
        </div>
    )
}

export default page