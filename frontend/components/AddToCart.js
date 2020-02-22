import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends Component {
  render() {
    const { id, me } = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{ id }}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}>
      {(addToCart, { loading }) => {
        if(!me) return <Link href={{pathname:'/signup'}}><a>Sign in to add to cart</a></Link>;
        return (
          <button disabled={loading} onClick={addToCart}>
            <i className="las la-plus"></i>Add{loading && 'ing'} to Cart
          </button>
        );
      }}
      </Mutation>
    );
  }

}

export default AddToCart;
export { ADD_TO_CART_MUTATION };
