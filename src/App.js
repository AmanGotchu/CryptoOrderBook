import React from 'react';
import './App.css';
// eslint-disable-next-line no-undef
// var Buffer = require('buffer/');
import getProducts from './coinbase_api/MarketCollector';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    getProducts();
  }

  render() {
    return (
      <p>Hello</p>
    );
  }
}

export default App;
