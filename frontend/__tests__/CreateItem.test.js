import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem } from '../lib/testUtils';

const fakeImage = 'https://image.com/image.jpg';

// mock the global fetchAPI
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: fakeImage,
    eager: [{ secure_url: fakeImage }],
  })
});

describe("<CreateItem/>", () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    // simulate user uploading file
    input.simulate('change', { target: { files: ['fakefile.jpg']}});
    await wait();

    const component = wrapper.find('CreateItem').instance();
    // console.log(component);
    expect(component.state.image).toEqual(fakeImage);
    expect(component.state.largeImage).toEqual(fakeImage);
    expect(global.fetch).toHaveBeenCalled();
    // expect(global.fetch).toHaveBeenCualledWith('ddjsffjl');
  });
});
