import React from 'react'
import Slider from 'react-slick'
import { assets } from '../../assets/assets'

const Testimonials = () => {

    const settings={
        dots: true,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 3,
        swipeToSlide:true,

        responsive:[
            { 
                breakpoint: 992,
                settings:{
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                }
            },
            {
                breakpoint: 567,
                settings: {
                    slidesToShow:1,
                    slidesToScroll: 1,
                }
            }

        ]

    }



  return( <Slider { ... settings}> 
    <div className='testimonial py-4 px-3'>
        <p>We created incredible memories with Travel World's guides! Their enthusiasm and energy made every moment of our journey special. They were knowledgeable about the destinations and eager to share their insights, enriching our travel experience. It was an adventure filled with laughter and discovery.</p>
      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={assets.ava01} className='w-25 h-25 rounded-2' alt=''/>
        <div>
            <h5 className='mb-0 mt-3'>John Doe</h5>
            <p>Customer</p>
            </div>
      </div>
    </div>
    <div className='testimonial py-4 px-3'>
        <p>Travel World's tour exceeded our expectations! Their dedication to creating an unforgettable experience was evident in every aspect of the trip. From meticulously planned excursions to personalized attention, they made us feel like valued guests. It was truly a wonderful tour.</p>
      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={assets.ava02} className='w-25 h-25 rounded-2' alt=''/>
        <div>
            <h5 className='mb-0 mt-3'>Lia Franklin</h5>
            <p>Customer</p>
            </div>
      </div>
    </div>
    <div className='testimonial py-4 px-3'>
        <p>Our adventure with Travel World's guides was nothing short of fantastic! Their passion for travel and enthusiasm for exploration made every moment exciting. They shared fascinating stories and insights about the destinations, adding depth to our journey. It was an adventure we will never forget.</p>
      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={assets.ava03} className='w-25 h-25 rounded-2' alt=''/>
        <div>
            <h5 className='mb-0 mt-3'>Nolen Roberts</h5>
            <p>Customer</p>
            </div>
      </div>
    </div>
    <div className='testimonial py-4 px-3'>
        <p>Travel World's tour guides provided exceptional service during our trip. Their knowledge and friendliness enhanced our travel experience, and they were always available to answer our questions and offer recommendations. We felt well taken care of throughout the journey.</p>
      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={assets.ava04} className='w-25 h-25 rounded-2' alt=''/>
        <div>
            <h5 className='mb-0 mt-3'>Jacob Harrisom</h5>
            <p>Customer</p>
            </div>
      </div>
    </div>
    <div className='testimonial py-4 px-3'>
        <p> Embarking on a journey with Travel World's tour guides was an unforgettable experience! Their passion for travel and dedication to providing top-notch service were evident throughout the trip. They expertly crafted an itinerary that allowed us to explore hidden gems and immerse ourselves in the local culture. It was a journey filled with unforgettable memories</p>
      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={assets.ava05} className='w-25 h-25 rounded-2' alt=''/>
        <div>
            <h5 className='mb-0 mt-3'>Emma Carter</h5>
            <p>Customer</p>
            </div>
      </div>
    </div>
    <div className='testimonial py-4 px-3'>
        <p>Our experience with Travel World's guides was truly amazing! Their friendly demeanor and extensive knowledge of the destinations we visited made every moment memorable. From historical insights to local anecdotes, they went above and beyond to ensure we had an unforgettable journey."</p>
      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={assets.ava06} className='w-25 h-25 rounded-2' alt=''/>
        <div>
            <h5 className='mb-0 mt-3'>Olivia White</h5>
            <p>Customer</p>
            </div>
      </div>
    </div>
    

  </Slider>)
}

export default Testimonials
