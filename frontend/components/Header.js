import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import NProgress from 'nprogress';

import Nav from './Nav';
import Cart from './Cart';
import Search from './Search';

Router.onRouteChangeStart = () => {
  NProgress.start();
}
Router.onRouteChangeComplete = () => {
  NProgress.done();
}
Router.onRouteChangeError = () => {
  NProgress.done();
}


const Logo = styled.h1`
  font-size: 2rem;
  margin-left: 2rem;
  position: relative;
  padding: 1rem 0;
  z-index: 2;
  transform: skew(-7deg);
  a {
    padding: 0.5rem 1.5rem;
    background: ${props => props.theme.red};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }
  img {
    transform: skew(21deg);
    height: 50px;
    postion: relative;
    right: -5px;
  }
  @media (max-width: 1300px) {
    text-align: center;
    margin: 0;
  }
`;

const StyledHeader = styled.div`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .subbar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;


const Header = (props) => (
  <StyledHeader>
    <div className='bar'>
      <Logo>
        <img src="../static/favicon.png" alt="nyse-logo"/>
        <Link href="/">
          <a>NY Sock Exchange</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className='subbar'>
      <Search />
    </div>
    <Cart />
  </StyledHeader>
);

export default Header;
