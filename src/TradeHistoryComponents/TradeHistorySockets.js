/* eslint-disable react/require-render-return */
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TradeHistoryRow from './TradeHistoryRow';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import '../App.css';

import {getProducts} from '../coinbase_api/MarketCollector';

import { w3cwebsocket as W3CWebSocket } from "websocket";
const client = new W3CWebSocket('wss://ws-feed.pro.coinbase.com');

class TradeHistorySockets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        anchorEl: null,
        tradeData: [],
        productLoading: true,
        tradeHistoryLoading: true,
        selectedProduct: "",
        searchInput: "",
        lastUpdate: "",
        interval: null,
    }

    this.menuItems = [];
    this.products = []

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.switchProduct = this.switchProduct.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  async componentDidMount() {
    this.products = await getProducts()
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        console.log(err);
    })

    this.menuItems = this.products.map((product) => {
        return (
            <MenuItem onClick={() => this.switchProduct(product.id)} key={product.id} style={{ width: 300 }}>
                {product.id}
            </MenuItem>
        );
    })

    client.onopen = async () => {
        console.log('WebSocket Client Connected');

        client.onmessage = async (message) => {
            const messageJSON = JSON.parse(message.data);
            if(messageJSON.type == "match") {
                const tradeTime = new Date(messageJSON.time);
                var hours = tradeTime.getHours() + "";
                hours = hours.padStart(2, "0");

                var minutes = tradeTime.getMinutes() + "";
                minutes = minutes.padStart(2, "0");

                var seconds = tradeTime.getSeconds() + "";
                seconds = seconds.padStart(2, "0");

                const tradeString = hours + ":" + minutes + ":" + seconds;

                var newTradeData = [<TradeHistoryRow 
                    key={messageJSON.trade_id}
                    tradeSize={messageJSON.size}
                    tradePrice={messageJSON.price}
                    tradeTime={tradeString}
                />, ...this.state.tradeData];
                
                if(newTradeData.length > 100) {
                    newTradeData.splice(100-newTradeData.length);
                }
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
    if(pair == null || pair == "") {
        return;
    }
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

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  onSearchChange(evt, product) {
    console.log(evt);
    this.switchProduct(product.id)
  }

  render() {
    return (
      <div style={styles.containerStyle}>
          <div style={styles.searchBar}>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} style={{ width: 250, backgroundColor: "#d4d4d4", borderRadius: 0 }}>
                {this.state.selectedProduct || "Open Menu"}
            </Button>

            <Autocomplete 
                style={{ display: "flex", width: 250, height: "90%", border: 0, paddingRight: 10 }} 
                id="combo-box-demo"
                options={this.products}
                getOptionLabel={(product) => product.id}
                renderInput={(params) => <TextField {...params} label="Crypto Pairs" />}
                inputValue={this.state.searchInput}
                onChange={this.onSearchChange}
                onInputChange={(evt, val) => this.setState({ searchInput: val })}
                />
          </div>
          
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
            style={{ backgroundColor: "#ededed", zIndex: -1 }}
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
        border: "1px solid #ededed",
        zIndex: 1
    },
    searchBar: {
        display: "flex",
        width: "100%",
        height: 50,
        justifyContent: "space-between"
    }
}

export default TradeHistorySockets;
