import React, { Component } from 'react';
import Head from 'next/head';
import OrderListStyles from '../components/styles/OrderItemStyles';
import User from '../components/User';


const About = (props) => (
  <User>
  {({ data: { me }})=> (
    <OrderListStyles>
      <h2>Your account details</h2>
      <p>
        <span>Name:{' '}</span>
        <span>{me.name}</span>
      </p>
      <p>
        <span>Email:{' '}</span>
        <span>{me.email}</span>
      </p>
    </OrderListStyles>
  )}
  </User>
);

export default About;
