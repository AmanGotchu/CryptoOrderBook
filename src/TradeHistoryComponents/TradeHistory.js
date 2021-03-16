/* eslint-disable react/require-render-return */
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TradeHistoryRow from './TradeHistoryRow';
// import loading from './loading.svg';
import '../App.css';

import {getProducts, getTradeHistory} from '../coinbase_api/MarketCollector';

class TradeHistory extends React.Component {
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

    this.even = false;
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setTradeHistory = this.setTradeHistory.bind(this);
  }

  setTradeHistory(product_id) {
    if(!this.state.tradeHistoryLoading) {
        return;
    }

    getTradeHistory(product_id)
    .then((res) => {
        var tradeRes = res.data.map((trade) => {
            this.even = !this.even;
            return (
                <TradeHistoryRow 
                    key={trade.time}
                    colorValue={this.even}
                    tradeSize={trade.size}
                    tradePrice={trade.price}
                    tradeTime={trade.time}
                />
            );
        })

        this.setState({ 
            tradeData: tradeRes,
            tradeHistoryLoading: false,
            selectedProduct: product_id
        })
    })
    .catch((err) => {
        console.log(err);
    });
  }

  async componentDidMount() {
    const products = await getProducts()
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        console.log(err);
    })

    const interval = setInterval(() => {
        this.setState({
            tradeHistoryLoading: true
        }, () => {console.log("Set trade"); this.setTradeHistory(this.state.selectedProduct)})
    }, 5000);

    this.setState({
        products: products,
        productLoading: false,
        selectedProduct: "BTC-USD",
        interval,
        lastUpdate: Date.now()
    })
  }

  componentWillUnmount() {
      clearInterval(this.state.interval);
  }

  handleOpen() {

  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const menuItems = this.state.products.map((product, index) => {
        return (
            <MenuItem onClick={() => {this.handleClose(); this.setState({ selectedProduct: product.id, tradeHistoryLoading: true })}} key={index}>
                {product.id}
            </MenuItem>
        );
    })

    console.log(this.state.selectedProduct);

    return (
      <div style={styles.containerStyle}>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
            {this.state.selectedProduct || "Open Menu"}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
            >
            {menuItems}
          </Menu>
          <TradeHistoryRow 
            key={-1}
            tradeSize={"Trade Size"}
            tradePrice={"Trade Price"}
            tradeTime={"Trade Time"}
        />
        {this.state.tradeData}
        {/* {this.state.tradeHistoryLoading && <img className="rotateClass" style={{display: "flex", height: 200, width: 200}} src={loading} />} */}
      </div>
    );
  }
}

const styles = {
    containerStyle: {
        display: "flex",
        height: 800,
        border: '2px solid yellow',
        width: "60%",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "scroll"
    }
}

export default TradeHistory;
