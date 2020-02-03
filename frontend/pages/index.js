import React from 'react';
import Link from 'next/link';

const Home = props => (
  <div>
    <div>Hey</div>
    <Link href="/sell">
      <a>Sell!</a>
    </Link>
  </div>
);

export default Home;
