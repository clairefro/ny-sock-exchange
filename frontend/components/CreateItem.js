import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
    isLoadingImage: false,
  }

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;

    // name is 'title', 'price', 'description' etc
    this.setState({ [name]: val });
  }

  uploadFile = async (e) => {
    // console.log('uploading file...');
    // get file
    this.setState({ isLoadingImage: true });
    const files = e.target.files;
    const data = new FormData();
    // these below are needed by cloudinary
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');
    // hit the cloudinary api
    const res = await fetch('https://api.cloudinary.com/v1_1/dgxkozw6v/image/upload', {
        method: "POST",
        body: data
    });
    const file = await res.json();
    // console.log(file);

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
      isLoadingImage: false,
    });
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (

        <Form data-test="form" onSubmit={async e => {
          e.preventDefault();
          // push data from state to server to create item
          const res = await createItem();
          // console.log(res);

          // redirect to show page
          Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id }
          });

        }}>
          <ErrorMessage error={error}/>
          <fieldset disabled={loading} aria-busy={loading || this.state.isLoadingImage}>

            <label htmlFor="file">
              Socks Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
                onChange={this.uploadFile}
              />
              {this.state.isLoadingImage && <p className="loading-text">Loading your image...</p>}
              {this.state.image &&
                <img width="200"
                     src={this.state.image
                         .replace('https://res.cloudinary.com/advreactwgqlwb/image/upload/',
                                  'https://res.cloudinary.com/advreactwgqlwb/image/upload/t_media_lib_thumb/'
                         )}
                     alt="preview"/>}
            </label>

            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={this.state.title}
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="price">
              Price in cents (USD)
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                required
                value={this.state.price}
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="description">
              Description
              <input
                id="description"
                name="description"
                placeholder="Enter a description"
                required
                value={this.state.description}
                onChange={this.handleChange}
              />
            </label>
            <button disabled={this.state.isLoadingImage ? true : false} type="submit">Sell them!</button>
          </fieldset>
        </Form>

      )}
    </Mutation>
    );
  }

}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
