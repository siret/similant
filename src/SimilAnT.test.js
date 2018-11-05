import React from 'react';
import ReactDOM from 'react-dom';
import SimilAnT from './SimilAnT';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SimilAnT />, div);
  ReactDOM.unmountComponentAtNode(div);
});
