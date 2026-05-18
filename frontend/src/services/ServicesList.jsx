import React from 'react'
import ServiceCard from './ServiceCard'
import { Col } from 'reactstrap'
import {assets} from '../assets/assets'
const servicesData =[
  {
    imgUrl: assets.guideImg,
    title: "Best Tour Guide",
    desc: "Explore with knowledgeable guides who animate destinations.",
  },
  {
    imgUrl: assets.customizationImg,
    title: "Customization",
    desc: "Tailor your trip to your preferences and create your dream vacation",
  },
  
]
const ServicesList = () => {
  return (
    <>
      {
        servicesData.map((item,index)=> (<Col lg='3' md='6' sm='12' className='mb-4' key={index}><ServiceCard item={item}/></Col>))
      }
    </>
  )
}

export default ServicesList
