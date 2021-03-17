/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';

function TradeVisual(props) {
    console.log("TradeVisual: ", props.selectedProduct);
    return (
        <React.Fragment>
            {props.selectedProduct}
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        selectedProduct: state.trade.selectedProduct
    }
}

export default connect(mapStateToProps)(TradeVisual);