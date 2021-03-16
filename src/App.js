import React from 'react';
import './App.css';
// eslint-disable-next-line no-undef
// var Buffer = require('buffer/');
// import TradeHistory from './TradeHistoryComponents/TradeHistory';
import TradeHistorySockets from './TradeHistoryComponents/TradeHistorySockets';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { innerWidth: width, innerHeight: height } = window;
    this.state = {
      width,
      height
    } 
  }

  componentDidMount() {

  }

  render() {
    return (
      <div style={{ display: "flex", width: "100%", height: this.state.height, justifyContent: "center", alignItems: "center"}}>
        <TradeHistorySockets/>
        {/* <TradeHistory /> */}
      </div>
    );
  }
}

export default App;
