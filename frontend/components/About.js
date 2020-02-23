import React, { Component } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import { Query } from 'react-apollo';
import Head from 'next/head';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import User from '../components/User';
import CartItem from '../components/CartItem';
import formatMoney from '../lib/formatMoney';

const USER_ITEMS_QUERY = gql`
  query USER_ITEMS_QUERY($id: ID!) {
    userItems(id: $id) {
      id
      image
      title
      price
      description
    }
  }
`;

const AccountDetailStyles = styled.li`
  box-shadow: ${props => props.theme.bs};
  list-style: none;
  width: 60vw;
  padding: 2rem;
  border-bottom: 4px solid ${props => props.theme.red};
  h2 {
    border-bottom: 2px solid red;
    margin-top: 0;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
  .link {
    color: ${props => props.theme.red};
    text-decoration: underline;
  }
`;

const ItemStyles = styled.div`
  a {
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img {
      margin-right: 2rem;
    }
    h3,p {
      margin: 0;
    }
  }
`;

const About = (props) => (
  <User>
  {({ data: { me }})=> (
    <AccountDetailStyles>
      <h2>Your account details</h2>
      <p>
        <span>Name:{' '}</span>
        <span>{me.name}</span>
      </p>
      <p>
        <span>Email:{' '}</span>
        <span>{me.email}</span>
      </p>
      <h2>Your socks for sale</h2>
      <Query query={USER_ITEMS_QUERY} variables={{ id: me.id }}>
      {(data)=> {
        if(!data.data.userItems.length) return <p>
        You haven't listed any socks yet...
        <Link href={{
          pathname: '/sell'
        }}>
        <a className="link">{' '}Sell some!</a>
        </Link></p>
        return data.data.userItems.map((item)=> (
          <ItemStyles key={item.id}>
            <Link href={{
              pathname: '/item',
              query: { id: item.id}
            }}>
               <a>
                 <img
                   src={item.image}
                   alt={item.title}
                   width="100px"
                   />
                 <div className="cart-item-details">
                   <h3>{item.title}</h3>
                   <p>
                     {formatMoney(item.price)}
                    </p>
                 </div>
               </a>
              </Link>
          </ItemStyles>
        ))
      }}
      </Query>
    </AccountDetailStyles>
  )}
  </User>
);

export default About;
