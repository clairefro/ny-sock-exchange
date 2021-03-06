import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Meta from './Meta';
import Header from './Header';
import Footer from './Footer';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
  display: flex;
  flex-direction: column;

  .page-container {
    min-height: calc(100vh - 200px - 83px - 50px - 100px);
    overflow: hidden;
  }
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const GlobalStyle =
  createGlobalStyle`@font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    // font-family: 'radnika_next';
    font-family: 'radnika_next', sans-serif;
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
  button {
    &:hover {
      cursor: pointer;
    }
  }
`;

class Page extends Component {
  render() {
    return (
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <StyledPage>
            <Meta />
            <Header />
            <div className="page-container">
              <Inner>
              {this.props.children}
              </Inner>
            </div>
            <Footer />
          </StyledPage>
        </ThemeProvider>
    );
  }
}

export default Page;
