import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();

// helper to simulate typing text into input fields in form
function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value },
  });
};

const mocks = [
  // signup user mutation
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: me.email,
        name: me.name,
        password: 'aaaaaa',
      },
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // current user query mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
];

describe("<Signup/>", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('form[data-test="form"]'))).toMatchSnapshot();
  });

  it("calls the mutation properly", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
        {client => {
          apolloClient = client;
          return <Signup />
        }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // fill out name, email, password fields
    type(wrapper, 'name', me.name);
    type(wrapper, 'email', me.email);
    type(wrapper, 'password', 'aaaaaa');
    wrapper.update();
    // simulate submiting form
    wrapper.find('form[data-test="form"]').simulate('submit');
    // just throwing this in here to fire events in right order....
    await wait();
    // query user out of apolloClient
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // console.log(apolloClient.store.cache.data);
    expect(user.data.me).toMatchObject(me);
  });
});
