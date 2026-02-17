import React from 'react'
import '../styles/Home.css'
import { Container, Row, Col } from 'reactstrap'
import { assets } from '../assets/assets'
import Subtitle from './../shared/Subtitle'
import SearchBar from '../shared/SearchBar'
import ServiceList from '../services/ServicesList'
import FeaturedTourList from '../components/FeaturedTours/FeaturedTourList'
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery'
import Testimonials from '../components/Testimonial/Testimonials'
const Home = () => {
  return (
   <>
    {/*==========hero section==========*/}
    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='hero__content'>
              <div className='hero__subtitle d-flex align-item-center'>
                <Subtitle subtitle={'Know Before You Go'}/>
                <img src={assets.worldImg} alt=''/>
              </div>
              <h1>
                Traveling opens the door to creating {""}
                <span className='highlight'>memories</span>
              </h1>
              <p>
              Explore the world with confidence, equipped with the knowledge to make your journey unforgettable. Prepare yourself with essential tips, insights, and advice for a seamless travel experience with Travel World.
                </p>
            </div>
          </Col>
          <Col lg='2'>
            <div className='hero__img-box'>
              <img src={assets.heroImg} alt=''/>
            </div>
          </Col>
          <Col lg='2'>
            <div className='hero__img-box hero__video-box mt-4'>
              <video src={assets.heroVideo} alt='' controls/>
            </div>
          </Col>
          <Col lg='2'>
            <div className='hero__img-box mt-5'>
              <img src={assets.heroImg2} alt=''/>
            </div>
          </Col>
          <SearchBar/>
        </Row>
      </Container>
    </section>

    <section>
      <Container>
        <Row>
          <Col lg='3'>
            <h5 className='services__subtitle'>What we serve</h5>
            <h2 className='services_title'>We offer our best services</h2>
          </Col>
          <ServiceList/>
        </Row>
      </Container>
    </section>

    {/*===============featured tour section start=================*/}
    <section>
      <Container>
        <Row>
          <Col lg='12' className='mb-5'>
            <Subtitle subtitle={'Explore'}/>
            <h2 className='featured__tour-title'>Our featured tours</h2>
          </Col>
          <FeaturedTourList/>
        </Row>
      </Container>
    </section>
    {/*===============featured tour section end=================*/}

    {/*===========gallery section starts============*/}
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle subtitle={'Gallery'}/>
            <h2 className='gallery__title'>Visit our customers tour gallery</h2>
          </Col>
          <Col lg='12'>
            <MasonryImagesGallery />

          </Col>
        </Row>
      </Container>
    </section>

    {/*===========galery section ends============*/}
    
    {/*===============testimonial section starts===============*/}
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle subtitle={'Customers Love'}/>
            <h2 className='testimonial__title'>What our customers say</h2>
          </Col>
          <Col lg='12'>
            <Testimonials />
          </Col>
        </Row>
      </Container>
    </section>
    {/*===============testimonial section starts===============*/}
    </>
  )
}

export default Home
