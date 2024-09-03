import React from 'react';
import SideBarAdmin from '../../components/adminComponents/SideBar';
import { Container } from 'react-bootstrap';


function HomeScreen() {
  return (
    <div className="d-flex">
      <SideBarAdmin/>
      <div className='content'>
        <h1>HomeScreen</h1>
      </div>
    </div>
  );
}

export default HomeScreen;
