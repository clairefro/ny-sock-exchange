import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';

const FooterStyles = styled.div`
  background-color: ${props => props.theme.grey};
  color: ${props => props.theme.offWhite};
  padding: 20px;
`;

const Footer = (props) => (
  <FooterStyles>
    <p>TODO: Write a footer</p>
  </FooterStyles>
);

export default Footer;
