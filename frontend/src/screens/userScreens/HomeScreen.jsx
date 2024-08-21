import React, {useEffect} from 'react'
import Card from '../../components/userComponents/Card.jsx'
import { Container } from 'react-bootstrap'

function HomeScreen() {
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.go(1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <>
    <Container>
      <Card/>
    </Container>
    </>
  )
}

export default HomeScreen
