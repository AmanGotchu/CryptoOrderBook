// import React from 'react';
// import './App.css';
// // eslint-disable-next-line no-undef
// // var Buffer = require('buffer/');
// // import TradeHistory from './TradeHistoryComponents/TradeHistory';
// import TradeHistorySockets from './TradeHistoryComponents/TradeHistorySockets';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
// } from "react-router-dom";
// import { Provider } from 'react-redux';
// import store from './redux/store';

// import {getProducts} from './coinbase_api/MarketCollector';

// import { w3cwebsocket as W3CWebSocket } from "websocket";
// const client = new W3CWebSocket('wss://ws-feed.pro.coinbase.com');

// class App extends React.Component {
//   constructor(props) {
//     super(props);

//     const { innerWidth: width, innerHeight: height } = window;
//     this.state = {
//       width,
//       height,
//       trades: [],
//       selectedProduct: "BTC-USD",
//       counter: 0
//     } 

//     this.products = []
//     this.interval = null;

//     this.switchProduct = this.switchProduct.bind(this);
//   }

//   async componentDidMount() {
//     console.log("App mounted");
//     this.products = await getProducts()
//     .then((res) => {
//         return res.data;
//     })
//     .catch((err) => {
//         console.log(err);
//     })

//     client.onopen = async () => {
//         console.log('WebSocket Client Connected');

//         client.onmessage = async (message) => {
//             const messageJSON = JSON.parse(message.data);
//             if(messageJSON.type == "match") {
//                 var newTradeData = [...this.state.trades, messageJSON]
//                 if(newTradeData.length > 100) {
//                   newTradeData.splice(100-newTradeData.length);
//                 }
//                 console.log("Counter", this.state.counter);
//                 this.setState({ trades: newTradeData, counter: this.state.counter+1 })
//             }
//         };

//         client.send(JSON.stringify({
//             "type": "subscribe",
//             "product_ids": ["BTC-USD"],
//             "channels": ["full"]
//         }))
//         console.log("Sending subscribe request");
//     };
//   }

//   componentWillUnmount() {
//     client.send(JSON.stringify({
//         "type": "unsubscribe",
//         "product_ids": [this.state.selectedProduct],
//         "channels": ["full"]
//     }))
//     console.log("App unmounted");
//   }


//   switchProduct(nextProduct) {
//     client.send(JSON.stringify({
//       "type": "unsubscribe",
//       "product_ids": [this.state.selectedProduct],
//       "channels": ["full"]
//     }))

//     this.setState({ selectedProduct: nextProduct, trades: [] }, () => {
//       client.send(JSON.stringify({
//         "type": "subscribe",
//         "product_ids": [nextProduct],
//         "channels": ["full"]
//     }));
//     })
//   }

//   render() {
//     return (
//       <Provider store={store}>
//         <Router>
//           <Switch>
//             <Route path="/trades">
//             <div style={{ display: "flex", width: "100%", height: this.state.height, justifyContent: "center", alignItems: "center"}}>
//               <TradeHistorySockets
//                 selectedProduct={this.state.selectedProduct}
//                 trades={this.state.trades}
//                 products={this.products}
//                 switchProduct={this.switchProduct}
//               />
//               {/* <TradeHistory /> */}
//             </div>
//             </Route>
//             <Route path="/test">
//               <p>{this.state.selectedProduct}</p>
//             </Route>
//             <Route path="/">
//                 <p>Home</p>
//             </Route>
//           </Switch>
//         </Router>
//       </Provider>
//     );
//   }
// }

// export default App;





import React, { useEffect, useState } from "react";
import './App.css';
// eslint-disable-next-line no-undef
// var Buffer = require('buffer/');
// import TradeHistory from './TradeHistoryComponents/TradeHistory';
import TradeHistorySockets from './TradeHistoryComponents/TradeHistorySockets';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';

import {getProducts} from './coinbase_api/MarketCollector';

import { w3cwebsocket as W3CWebSocket } from "websocket";
const client = new W3CWebSocket('wss://ws-feed.pro.coinbase.com');

export default function App() {
  // const [width, setWidth] = useState(window.width);
  const [height] = useState(window.innerHeight);
  const [trades, setTrades] = useState([]);
  const [product, setProduct] = useState("BTC-USD");
  const [products, setProducts] = useState([]);

  // const [value, setValue] = useState(true);

  useEffect(async () => {
    console.log("Called effect");
    await getProducts()
    .then((res) => {
      setProducts(res.data);
    })
    .catch((err) => {
        console.log(err);
    })

    client.onopen = async () => {
        console.log('WebSocket Client Connected');

        client.onmessage = async (message) => {
            const messageJSON = await JSON.parse(message.data);
            if(messageJSON.type == "match") {
              updateTrades(messageJSON);
            }
        };

        client.send(JSON.stringify({
            "type": "subscribe",
            "product_ids": ["BTC-USD"],
            "channels": ["full"]
        }))
        console.log("Sending subscribe request");
    };


    return () => {
      console.log("Unmounted");

      client.send(JSON.stringify({
          "type": "unsubscribe",
          "product_ids": [product],
          "channels": ["full"]
      }));
    }
  }, []);

  const updateTrades = (newTrade) => {
    // const newTradeData = [...trades, newTrade];
    // console.log("App trades length", newTradeData.length);
    // console.log(newTradeData);
    // if(newTradeData.length > 100) {
    //   newTradeData = newTradeData.drop(newTradeData.length-100);
    // }
    setTrades(prevTrades => {
      const newTradeData = [...prevTrades, newTrade];
      if(newTradeData.length > 100) {
        newTradeData.splice(100-newTradeData.length);
      }
      return newTradeData;
    });
  }

  const switchProduct = (nextProduct) => {
    client.send(JSON.stringify({
      "type": "unsubscribe",
      "product_ids": [product],
      "channels": ["full"]
    }))

    setProduct(nextProduct);
    setTrades([]);

    // How to run a callback on useState methods
    client.send(JSON.stringify({
        "type": "subscribe",
        "product_ids": [nextProduct],
        "channels": ["full"]
    }));
  }

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/">
          <div style={{ display: "flex", width: "100%", height: height, justifyContent: "center", alignItems: "center"}}>
            <TradeHistorySockets
              selectedProduct={product}
              trades={trades}
              products={products}
              switchProduct={switchProduct}
            />
            {/* <TradeHistory /> */}
          </div>
          </Route>
          <Route path="/test">
            <p>{product}</p>
          </Route>
          <Route path="/">
              <p>Home</p>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}
