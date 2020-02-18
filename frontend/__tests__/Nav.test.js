import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: {
      ...fakeUser(),
      cart: [fakeCartItem(),fakeCartItem(),fakeCartItem()]
    } } },
  },
];

describe("<Nav />", () => {
  it('renders a minimal nav when not signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    const nav = wrapper.find('[data-test="nav"]');
    // console.log(toJSON(nav));
    // expect(toJSON(nav)).toMatchSnapshot();
    expect(nav.children().length).toBe(4);
  });

  it('renders a full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    // add ul selector because this data attribute is doubly rendered due to styled components
    const nav = wrapper.find('ul[data-test="nav"]');
    // console.log(toJSON(nav));
    // console.log(nav.debug());
    // expect(toJSON(nav)).toMatchSnapshot();
    expect(nav.children().length).toBe(6);
    expect(nav.text()).toContain('Sign out');
  });

  it('renders amount of items in cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    // add ul selector because this data attribute is doubly rendered due to styled components
    const nav = wrapper.find('ul[data-test="nav"]');
    const count = nav.find('div.count');
    // console.log(toJSON(nav));
    // console.log(nav.debug());
    // expect(toJSON(nav)).toMatchSnapshot();
    expect(toJSON(count)).toMatchSnapshot();
  });
});
