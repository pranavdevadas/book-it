import React from 'react'
import HorizontalCards from '../../components/userComponents/HorizontalCards.jsx'
import { Container } from 'react-bootstrap'
import Search from '../../components/userComponents/Search.jsx'

function MovieScreen() {
  return (
    <>
        <Container>
          <Search/>
            <HorizontalCards/>
        </Container>
    </>
  )
}

export default MovieScreen
