import React from 'react';
import styled from 'styled-components';


const AboutDevStyles = styled.div`
  text-align: center;
  a {
    color: ${props => props.theme.red};
  }
  i {
    font-size: 36px;
    color: ${props => props.theme.black}
    &:hover {
      color: ${props => props.theme.red};
      cursor: pointer;
    }
  }
`;

const AboutDevPage = props => (
  <AboutDevStyles>
    <h2>About the dev</h2>
    <p>Created by Claire Froelich under the tutelage of the great <a href="https://wesbos.com/">Wes Bos</a></p>
    <a target="_blank" href="https://github.com/clairefro"><i class="lab la-github"></i></a>
    <a target="_blank" href="https://www.linkedin.com/in/claire-froelich/"><i class="lab la-linkedin"></i></a>
  </AboutDevStyles>
);

export default AboutDevPage;
