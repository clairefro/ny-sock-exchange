import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint, prodEndpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';
import { TOGGLE_CART_MUTATION } from '../components/Cart';


function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        // headers: { cookie: headers && headers.cookie },
        headers: {
          cookie: headers && headers.cookie // NOTE: client-side headers is undefined!
        }
      });
    },

    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // read cartOpen value from cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            const data = {
              data: { cartOpen: !cartOpen }
            };
            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

export default withApollo(createClient);
