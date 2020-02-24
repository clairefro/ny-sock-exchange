import React from 'react';
import Link from 'next/link';
import About from '../components/About';
import PleaseSignIn from '../components/PleaseSignIn';


const AccountPage = props => (
  <PleaseSignIn>
    <About />
  </PleaseSignIn>
);

export default AccountPage;
