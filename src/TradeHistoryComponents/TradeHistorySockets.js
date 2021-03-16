/* eslint-disable react/require-render-return */
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TradeHistoryRow from './TradeHistoryRow';
import '../App.css';

import {getProducts} from '../coinbase_api/MarketCollector';

import { w3cwebsocket as W3CWebSocket } from "websocket";
const client = new W3CWebSocket('wss://ws-feed.pro.coinbase.com');

class TradeHistorySockets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        anchorEl: null,
        products: [],
        tradeData: [],
        productLoading: true,
        tradeHistoryLoading: true,
        selectedProduct: "BTC-USD",
        lastUpdate: "",
        interval: null
    }

    this.menuItems = [];

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.switchProduct = this.switchProduct.bind(this);
    this.test = this.test.bind(this);
  }

  async componentDidMount() {
    this.menuItems = await getProducts()
    .then((res) => {
        return res.data.map((product) => {
            return (
                <MenuItem onClick={() => this.switchProduct(product.id)} key={product.id} style={{ width: 300 }}>
                    {product.id}
                </MenuItem>
            );
        })
    })
    .catch((err) => {
        console.log(err);
    })

    client.onopen = async () => {
        console.log('WebSocket Client Connected');

        client.onmessage = async (message) => {
            const messageJSON = JSON.parse(message.data);
            if(messageJSON.type == "match") {
                const tradeTime = new Date(messageJSON.time);
                const tradeString = tradeTime.getHours() + ":" + tradeTime.getMinutes() + ":" + tradeTime.getSeconds();

                var newTradeData = [<TradeHistoryRow 
                    key={messageJSON.trade_id}
                    tradeSize={messageJSON.size}
                    tradePrice={messageJSON.price}
                    tradeTime={tradeString}
                />, ...this.state.tradeData];
                
                if(newTradeData.length > 100) {
                    newTradeData.splice(100-newTradeData.length);
                }
                console.log(newTradeData.length);
                this.setState({ tradeData: newTradeData })
            }
        };

        client.send(JSON.stringify({
            "type": "subscribe",
            "product_ids": ["BTC-USD"],
            "channels": ["full"]
        }))
        console.log("Sending subscribe request");
    };

    this.setState({
        productLoading: false,
        selectedProduct: "BTC-USD",
    })
  }

  componentWillUnmount() {
      client.send(JSON.stringify({
          "type": "unsubscribe",
          "product_ids": [this.state.selectedProduct],
          "channels": ["full"]
      }))
  }

  switchProduct(pair) {
    if(this.state.selectedProduct != null) {
        client.send(JSON.stringify({
            "type": "unsubscribe",
            "product_ids": [this.state.selectedProduct],
            "channels": ["full"]
        }));
    }

    client.send(JSON.stringify({
        "type": "subscribe",
        "product_ids": [pair],
        "channels": ["full"]
    }));

    this.setState({ selectedProduct: pair, tradeData: [], anchorEl: null });
  }

  test() {
      console.log("WTF");
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    return (
      <div style={styles.containerStyle}>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} style={{ width: "100%" }}>
            {this.state.selectedProduct || "Open Menu"}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
            >
            {this.menuItems}
          </Menu>
          <TradeHistoryRow 
            key={-1}
            tradeSize={"Trade Size"}
            tradePrice={"Trade Price"}
            tradeTime={"Trade Time"}
        />
        <div style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "scroll"
        }}
            className="history">
            {this.state.tradeData}
        </div>
      </div>
    );
  }
}

const styles = {
    containerStyle: {
        display: "flex",
        height: 800,
        width: "60%",
        flexDirection: "column",
        alignItems: "center",
    }
}

export default TradeHistorySockets;
