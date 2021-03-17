/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-render-return */
import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import TradeHistoryRow from './TradeHistoryRow';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import '../App.css';

export default function TradeHistorySockets(props) {
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        // console.log("Trade added!");
    }, [props.trades])

    var products = [];
    const onSearchChange = (evt, product) => {
        console.log(product);
        if(product !== null) {
            props.switchProduct(product.id)
        }
    }

    var tradeItems = props.trades.map((trade) => {
        const tradeTime = new Date(trade.time);
        var hours = tradeTime.getHours() + "";
        hours = hours.padStart(2, "0");

        var minutes = tradeTime.getMinutes() + "";
        minutes = minutes.padStart(2, "0");

        var seconds = tradeTime.getSeconds() + "";
        seconds = seconds.padStart(2, "0");

        const tradeString = hours + ":" + minutes + ":" + seconds;
        return (
            <TradeHistoryRow 
            key={trade.trade_id}
            tradeSize={trade.size}
            tradePrice={trade.price}
            tradeTime={tradeString}
        />
        );
    });
    tradeItems = tradeItems.reverse();

    return (
      <div style={styles.containerStyle}>
          <div style={styles.searchBar}>
            <Button aria-controls="simple-menu" aria-haspopup="true" style={{ width: 250, backgroundColor: "#d4d4d4", borderRadius: 0 }}>
                {props.selectedProduct || "Open Menu"}
            </Button>

            <Autocomplete 
                style={{ display: "flex", width: 250, height: "90%", border: 0, paddingRight: 10 }} 
                id="combo-box-demo"
                options={props.products}
                getOptionLabel={(product) => product.id}
                renderInput={(params) => <TextField {...params} label="Crypto Pairs" />}
                inputValue={searchInput}
                onChange={onSearchChange}
                onInputChange={(evt, val) => setSearchInput(val)}
                />
          </div>
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
            {tradeItems}
        </div>
      </div>
    );
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
