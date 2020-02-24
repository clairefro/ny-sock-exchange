import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';
import { TOGGLE_CART_MUTATION } from './Cart';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends Component {
  onToken = async (res, createOrder, toggleCart) => {
    NProgress.start();
    // console.log(res.id);
    // manually call mutation once we have stripe token
    const order = await createOrder({
      variables: {
        token: res.id,
      }
    }).catch((err)=> console.log(err.message));
    // close cart
    toggleCart();
    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id },
    });
  }

  render() {
    return (
      <User>
        {({ data: { me }, loading }) => {
          if(loading) return null;
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {(createOrder) => (
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                {(toggleCart)=>(
                  <StripeCheckout
                    amount={calcTotalPrice(me.cart)}
                    name="Sick Fits"
                    description={`Order of ${totalItems(me.cart)} items`}
                    image={me.cart.length && me.cart[0].item && me.cart[0].item.image.toString()}
                    stripeKey="pk_test_FPE4kezM8tLwOelNEeH99FER00Fi9DYv9e"
                    currency="USD"
                    email={me.email}
                    token={res => this.onToken(res, createOrder, toggleCart)}
                  >
                  {this.props.children}
                  </StripeCheckout>
                )}
                </Mutation>
            )}
          </Mutation>
          )
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };
