import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/userComponents/Header.jsx'
import { Container } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Header/>
      <ToastContainer/>
      <Container>
        <Outlet/>
      </Container>
    </>
  )
}

export default App
