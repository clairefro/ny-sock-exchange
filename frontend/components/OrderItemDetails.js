import React from 'react';
import formatMoney from '../lib/formatMoney';


const OrderItemDetails = (props) => {
  const item = props.item;
  return (
    <div className="order-item">
      <img height="50px" src={item.image} alt={item.title}/>
      <div className="item-details">
        <h2>{item.title}</h2>
        <p>Quantity: {item.quantity}</p>
        <p>Price ea: {formatMoney(item.price)}</p>
        <p>Subtotal: {formatMoney(item.price*item.quantity)}</p>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export default OrderItemDetails;
