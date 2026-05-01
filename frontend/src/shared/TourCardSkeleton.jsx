import React from 'react'
import { Card, CardBody } from 'reactstrap'
import './TourCardSkeleton.css'

const TourCardSkeleton = () => {
  return (
    <div className='tour__card skeleton__card'>
      <Card>
        <div className='skeleton__img skeleton__pulse'></div>
        <CardBody>
          <div className='skeleton__line skeleton__pulse' style={{width:'60%', height:'12px', marginBottom:'10px'}}></div>
          <div className='skeleton__line skeleton__pulse' style={{width:'80%', height:'16px', marginBottom:'14px'}}></div>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='skeleton__line skeleton__pulse' style={{width:'35%', height:'14px'}}></div>
            <div className='skeleton__btn skeleton__pulse'></div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default TourCardSkeleton
