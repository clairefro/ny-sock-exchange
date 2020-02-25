import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';

const FooterStyles = styled.div`
  background-color: ${props => props.theme.grey};
  color: ${props => props.theme.offWhite};
  font-family: Arial;
  padding: 20px;
  margin-top: 60px;
  flex-shrink: 0;
  width: 100%;
  height: 20rem;
  justify-self: flex-end;
  display: grid;
  
  a {
    color: ${props => props.theme.offWhite};
    &:hover {
      color: ${props => props.theme.red};
    }
  }
`;

const IconLinks = styled.div`
  font-size: 3rem;
  margin-right: 1rem;
  align-self: center;
  a {
    margin-right: 1rem;
  }
`;

const Footer = (props) => (
  <FooterStyles>
  <Link href={{pathname: '/about_site'}}>
    <a>About this site</a>
  </Link>
  <Link href={{pathname: '/about_dev'}}>
    <a>About the creator</a>
  </Link>
    <IconLinks>
      <a href="#"><i className="lab la-instagram"></i></a>
      <a href="#"><i className="lab la-facebook-square"></i></a>
      <a href="#"><i className="lab la-twitter"></i></a>
      <a href="#"><i className="lab la-vimeo"></i></a>
    </IconLinks>
  </FooterStyles>
);

export default Footer;
