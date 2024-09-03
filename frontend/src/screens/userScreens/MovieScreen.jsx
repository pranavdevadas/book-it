import React from 'react'
import HorizontalCards from '../../components/userComponents/HorizontalCards.jsx'
import { Container } from 'react-bootstrap'
import Search from '../../components/userComponents/Search.jsx'

function MovieScreen() {
  return (
    <>
        <Container>
          <h1 className='text-center mt-4 fw-bold'>Movies</h1>
          <Search/>
          <HorizontalCards/>
        </Container>
    </>
  )
}

export default MovieScreen
