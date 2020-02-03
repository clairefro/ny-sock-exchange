import React from 'react';
import Nav from './Nav';

const Header = (props) => (
  <div>
    <div className='bar'>
      <a href="">SickFits</a>
      <Nav />
    </div>
    <div className='subbar'>
      <p>Search</p>
    </div>
    <div>Cart</div>
  </div>
);

export default Header;
