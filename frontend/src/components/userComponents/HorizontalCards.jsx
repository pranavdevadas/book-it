import React from 'react'
import { Card, Button, Container } from 'react-bootstrap';
import cardPic from '../../assets/cardSample.jpeg'

function HorizontalCards() {
  return (
    <Container className="my-3">
        <Card style={{ display: 'flex', flexDirection: 'row', height: '250px' }} className='my-3'>
        <Card.Img 
            variant="left" 
            src={cardPic}
            style={{ width: '150px', height: '100%', objectFit: 'cover' }} 
        />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
            <Card.Text>
            This is a description of the card. It provides some information about the content of the card.
            </Card.Text>
            <Button variant="primary">Submit</Button>
        </Card.Body>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'row', height: '250px' }} className='my-3'>
        <Card.Img 
            variant="left" 
            src={cardPic}
            style={{ width: '150px', height: '100%', objectFit: 'cover' }} 
        />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
            <Card.Text>
            This is a description of the card. It provides some information about the content of the card.
            </Card.Text>
            <Button variant="primary">Submit</Button>
        </Card.Body>
        </Card>
    </Container>
  )
}

export default HorizontalCards
