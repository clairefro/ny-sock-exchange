import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'so cool item',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg'
}

describe('<Item />', () =>{
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  // it('renders the image properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const image = wrapper.find('img');
  //   console.log(image.props());
  //   expect(image.props().src).toBe(fakeItem.image);
  //   expect(image.props().alt).toBe(fakeItem.title);
  // });
  //
  // it('renders the price tag and title properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   console.log(wrapper.debug());
  //   const PriceTag = wrapper.find('ForwardRef(PriceTag)');
  //   expect(PriceTag.text()).toBe('$50');
  //   // console.log(wrapper.find('ForwardRef(Title) a').debug());
  //   expect(wrapper.find('ForwardRef(Title) a').text()).toBe(fakeItem.title);
  // });
  //
  // it('renders buttons', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   console.log(wrapper.debug());
  //   const buttonList = wrapper.find('.buttonList')
  //   console.log(buttonList.children());
  //   expect(buttonList.children()).toHaveLength(3);
  //   expect(buttonList.find('Link').exists()).toBe(true);
  //   expect(buttonList.find('AddToCart').exists()).toBe(true);
  //   expect(buttonList.find('DeleteItem').exists()).toBe(true);
  // });
});
