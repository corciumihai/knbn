import { BrowserRouter } from 'react-router-dom'
import View from './View';
import ReactDom from 'react-dom';
import React  from 'react';

ReactDom.render((
  <BrowserRouter>
    <View />
  </BrowserRouter>
), document.getElementById('view'));