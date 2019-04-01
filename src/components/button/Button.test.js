import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from './Button';

Enzyme.configure({ adapter: new Adapter() });

describe('Button', () => {
  it('отрисовывает без ошибки', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Дай мне больше</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('отрисовывает дочерний элемент', () => {
    const element = render(<Button>Test</Button>);

    expect(element[0].children[0].data).toEqual('Test');
  });

  test('есть корректный снимок', () => {
    const component = renderer.create(<Button>Дай мне больше</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
