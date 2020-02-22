import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import Error from './ErrorMessage';
import AddToCart from './AddToCart';
import formatMoney from '../lib/formatMoney';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => {props.theme.bs}};
  display: flex;
  align-items: center;
  min-height: 500px;
  img {
    width: 40%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    align-content: center;
    img {
      width: 100%;
    }
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
      price
    }
  }
`;

class SingleItem extends Component {

  render() {

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
        {({error, loading, data}) => {
          if(error) return <Error error={error} />
          if(loading) return <p>Loading...</p>
          if(!data.item) return <p>No Item found for id: {this.props.id}</p>
          const item = data.item
          console.log(item);
          return <SingleItemStyles>
            <Head>
              <title>NY Sock Exchange | {item.title}</title>
            </Head>
            <img src={item.largeImage} alt={item.title}/>
            <div className='details'>
              <h2>Viewing "{item.title}""</h2>
              <p>{formatMoney(item.price)}</p>
              <p>{item.description}</p>
              <AddToCart id={item.id} />
            </div>
          </SingleItemStyles>
        }}
      </Query>
    );
  }

}

export default SingleItem;
export { SINGLE_ITEM_QUERY };
