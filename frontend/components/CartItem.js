import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import RemoveFromCart from './RemoveFromCart';
import formatMoney from '../lib/formatMoney';

const CartItemStyles = styled.li`
  a {
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img {
      margin-right: 10px;
    }
    h3,p {
      margin: 0;
    }
  }
`;

const CartItem = ({ cartItem }) => {
  // first check if cart item still exists (wasn't deleted)
  if(!cartItem.item) return (
      <CartItemStyles>
      <p>This item is no longer available</p>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
  return (
    <CartItemStyles>
    <Link href={{
      pathname: '/item',
      query: { id: cartItem.item.id}
    }}>
       <a>
         <img
           src={cartItem.item.image}
           alt={cartItem.item.title}
           width="100px"
           />
         <div className="cart-item-details">
           <h3>{cartItem.item.title}</h3>
           <p>
             {formatMoney(cartItem.item.price * cartItem.quantity)}
             {' - '}
             <em>
               {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} ea.
             </em>
             </p>
         </div>
         <RemoveFromCart id={cartItem.id} />
       </a>
      </Link>
    </CartItemStyles>
  );
}


CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
}

export default CartItem;
