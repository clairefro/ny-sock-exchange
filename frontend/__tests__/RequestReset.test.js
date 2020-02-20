import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'claire@what.com' },
    },
    result: {
      data: { requestReset: { message: 'success', __typename: 'Message'}},
    },
  },
];

describe("<RequestReset />", () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    // console.log(wrapper.debug());
    const form = wrapper.find('form[data-test="form"]');
    // console.log(form.debug());
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate change event in typing in email (.simulate provided by enzyme)
    wrapper.find('input').simulate('change', { target: { name: 'email', value: 'claire@what.com' }});
    // submit the form
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();
    expect(wrapper.find('p').text()).toContain('Success! Check your email for a reset link.');
  });
});
