import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import cardPic from '../../assets/cardSample.jpeg'

function userCard() {
  return (
    <Card style={{ width: '18rem' }} className='mt-4'>
      <Card.Img variant="top" src={cardPic} />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  )
}

export default userCard
