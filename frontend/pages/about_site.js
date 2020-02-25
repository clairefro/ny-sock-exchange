import React from 'react';
import styled from 'styled-components';

const SitePageStyles = styled.div`
  a {
    color: ${props => props.theme.red};
  }
  .stack {
    display: flex;
    flex-wrap: wrap;
  }
  table {
    text-align: left;
    margin-right: 5rem;
    th {
      border-bottom: solid 2px ${props => props.theme.red};
    }
    td {
      padding: 1rem;
      padding-right: 2rem;
    }
  }
`;

const AboutSitePage = props => (
  <SitePageStyles>
    <h2>This is a fake e-commerce site.</h2>
    <p>If you really want to sell your socks, try <a href="https://www.craigslist.org/about/sites" target="_blank">CraigsList</a>.</p>
    <p>Or enjoy a fake shopping spree here with my credit card: 4242 4242 4242 4242 (exp. 2/22, sec. code: 222)</p>
    <p>This site was built to practice React and GraphQL principles taught in <a href="https://advancedreact.com/">Wes Bos' Advanced React Course</a>. </p>
    <div className="stack">
      <table>
        <tr>
          <th colspan="2">Frontend</th>
        </tr>
        <tr>
          <td><img src="../static/icons/react.png" width="100px" alt="react"/></td>
          <td>React</td>
        </tr>
        <tr>
          <td><img src="../static/icons/next.png" width="100px" alt="next.js"/></td>
          <td>Next.js</td>
        </tr>
        <tr>
          <td><img src="../static/icons/apollo.png" width="100px" alt="apollo"/></td>
          <td>Apollo</td>
        </tr>
        <tr>
          <td><img src="../static/icons/styled.png" width="100px" alt="styled components"/></td>
          <td>Styled Components</td>
        </tr>
      </table>
      <table>
        <tr>
          <th colspan="2">Backend</th>
        </tr>
        <tr>
          <td align="center"><img src="../static/icons/gql.png" width="60px" alt="react"/></td>
          <td>GraphQL Yoga</td>
        </tr>
        <tr>
          <td><img src="../static/icons/prisma.svg" width="100px" alt="prisma"/></td>
          <td>Prisma</td>
        </tr>
        <tr>
          <td><img src="../static/icons/postgre.png" width="100px" alt="postgresql"/></td>
          <td>PostgreSQL</td>
        </tr>
      </table>
    </div>


  </SitePageStyles>
);

export default AboutSitePage;
