import React, { useState, useEffect } from 'react'
import CommonSection from '../shared/CommonSection'
import '../styles/Tours.css'
import TourCard from '../shared/TourCard'
import TourCardSkeleton from '../shared/TourCardSkeleton'
import SearchBar from '../shared/SearchBar'
import { Container, Row, Col } from 'reactstrap'
import useFetch from '../hooks/useFetch'
import { BASE_URL } from '../utils/config'

const Tours = () => {
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage]           = useState(0)
  const [filterCity, setFilterCity]   = useState('')
  const [filterPrice, setFilterPrice] = useState('')
  const [sortBy, setSortBy]           = useState('')

  const { data: tours, loading, error } = useFetch(`${BASE_URL}/tours?page=${page}`)
  const { data: tourCount }             = useFetch(`${BASE_URL}/tours/search/getTourCount`)

  useEffect(() => {
    const pages = Math.ceil(tourCount / 8)
    setPageCount(pages)
    window.scrollTo(0, 0)
  }, [page, tourCount, tours])

  // Filter + sort locally
  const getFilteredTours = () => {
    if (!tours) return []
    let result = [...tours]

    if (filterCity.trim()) {
      result = result.filter(t => t.city.toLowerCase().includes(filterCity.toLowerCase()))
    }

    if (filterPrice) {
      const [min, max] = filterPrice.split('-').map(Number)
      result = result.filter(t => max ? t.price >= min && t.price <= max : t.price >= min)
    }

    if (sortBy === 'price_asc')  result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0))

    return result
  }

  const filteredTours = getFilteredTours()

  return (
    <>
      <CommonSection title='All Tours' />

      <section>
        <Container>
          <Row><SearchBar /></Row>
        </Container>
      </section>

      {/* Filter Bar */}
      <section className='pt-0 pb-0'>
        <Container>
          <div className='filter__bar d-flex align-items-center gap-3 flex-wrap'>
            <input
              type='text'
              placeholder='🔍 Filter by city...'
              className='filter__input'
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
            />
            <select className='filter__input' value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
              <option value=''>💰 All Prices</option>
              <option value='0-50'>Under $50</option>
              <option value='50-100'>$50 - $100</option>
              <option value='100-200'>$100 - $200</option>
              <option value='200'>$200+</option>
            </select>
            <select className='filter__input' value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value=''>↕ Sort By</option>
              <option value='price_asc'>Price: Low to High</option>
              <option value='price_desc'>Price: High to Low</option>
              <option value='rating'>Most Reviewed</option>
            </select>
            {(filterCity || filterPrice || sortBy) && (
              <button className='filter__clear' onClick={() => { setFilterCity(''); setFilterPrice(''); setSortBy('') }}>
                ✕ Clear
              </button>
            )}
            {!loading && (
              <span className='filter__count'>{filteredTours.length} tour(s) found</span>
            )}
          </div>
        </Container>
      </section>

      <section className='pt-3'>
        <Container>
          <Row>
            {/* Skeleton loading */}
            {loading && [...Array(8)].map((_, i) => (
              <Col lg='3' md='6' sm='6' className='mb-4' key={i}>
                <TourCardSkeleton />
              </Col>
            ))}

            {error && <h4 className='text-center pt-5'>{error}</h4>}

            {!loading && !error && filteredTours.length === 0 && (
              <Col lg='12'>
                <h5 className='text-center pt-5' style={{color:'#888'}}>
                  No tours found matching your filters. <button className='filter__clear' onClick={() => { setFilterCity(''); setFilterPrice(''); setSortBy('') }}>Clear filters</button>
                </h5>
              </Col>
            )}

            {!loading && !error && filteredTours.map(tour => (
              <Col lg='3' md='6' sm='6' className='mb-4' key={tour._id}>
                <TourCard tour={tour} />
              </Col>
            ))}

            {/* Pagination */}
            {!filterCity && !filterPrice && !sortBy && (
              <Col lg='12'>
                <div className='pagination d-flex align-items-center justify-content-center mt-4 gap-3'>
                  {[...Array(pageCount).keys()].map(number => (
                    <span key={number} onClick={() => setPage(number)}
                      className={page === number ? 'active__page' : ''}>
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Tours
