import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import Head from 'next/head';
import gql from 'graphql-tag';
import { format } from 'date-fns';
import formatMoney from '../lib/formatMoney';

import Error from '../components/ErrorMessage';
import OrderItemDetails from './OrderItemDetails';
import OrderStyles from '../components/styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }

    }
  }
`;

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }
  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{id: this.props.id}}>
        {({ data, error, loading }) => {
          if(error) return <Error error={error} />
          if(loading) return <p>Loading...</p>
          const order = data.order;
          return (
            <OrderStyles data-test="order">
              <Head>
                <title>NY Sock Exchange | Order: {order.id}</title>
              </Head>
              <p>
                <span>Order ID:</span>
                <span>{this.props.id}</span>
              </p>
              <p>
                <span>Charge:</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Order date:</span>
                <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
              </p>
              <p>
                <span>Order total:</span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>No. of items:</span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map(item => (
                  <OrderItemDetails item={item} key={item.id} />
                ))}
              </div>
            </OrderStyles>
          )
        }}
      </Query>
    );
  }

}

export default Order;
export { SINGLE_ORDER_QUERY };
