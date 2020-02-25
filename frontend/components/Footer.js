import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';

const FooterStyles = styled.div`
  background-color: ${props => props.theme.grey};
  color: ${props => props.theme.offWhite};
  padding: 20px;
  margin-top: 60px;
  flex-shrink: 0;
  /* position: absolute; */
  /* bottom: 0; */
  width: 100%;
  height: 20rem;
  justify-self: flex-end;
`;

const IconLinks = styled.div`
  font-size: 3rem;
  margin-right: 1rem;
  a {
    color: ${props => props.theme.offWhite};
    margin-right: 0.5rem;
    &:hover {
      color: ${props => props.theme.red};
    }
  }
`;

const Footer = (props) => (
  <FooterStyles>
    <p>TODO: Write a footer</p>
    <IconLinks>
      <a href="#"><i className="lab la-instagram"></i></a>
      <a href="#"><i className="lab la-facebook-square"></i></a>
      <a href="#"><i className="lab la-twitter"></i></a>
      <a href="#"><i className="lab la-vimeo"></i></a>
    </IconLinks>
  </FooterStyles>
);

export default Footer;
