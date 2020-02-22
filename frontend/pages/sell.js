import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn'
import CreateItem from '../components/CreateItem';

const Sell = props => (
  <div>
    <PleaseSignIn>
      <h2>Sell your socks!</h2>
      <CreateItem />
    </PleaseSignIn>
  </div>
);

export default Sell;
