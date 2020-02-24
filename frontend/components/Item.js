import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';
import Error from './ErrorMessage';
import User from './User';
import formatMoney from '../lib/formatMoney'

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render() {
    const { item } = this.props;
    return (
      <User>
      {({ data: { me }})=> {
        return (
          <ItemStyles>
          <Link href={{
            pathname: '/item',
            query: { id: item.id },
          }}>
            <a>
              {item.image && <img src={item.image} alt={item.title}/>}
              <Title>
              <a>{item.title}</a>
              </Title>
              <PriceTag>{formatMoney(item.price)}</PriceTag>
              <p>{item.description}</p>
            </a>
          </Link>
          <div className="buttonList">
          {me && me.id === item.user.id &&
            <Link href={{
              pathname: 'update',
              query: { id: item.id },
            }}>
              <a>Edit</a>
            </Link>
          }
          <AddToCart id={item.id} me={me}/>
          {me && me.id === item.user.id &&
          <DeleteItem id={item.id}>Delete</DeleteItem>
          }
          </div>
          </ItemStyles>
        );
      }}
      </User>

    );
  }

}

export default Item;
