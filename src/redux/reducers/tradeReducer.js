const INITIAL_STATE = {
    selectedProduct: "BTC-USD",
    tradeData: []
}
  
export default function trade(state = INITIAL_STATE, action) {
    console.log(action.type);
    switch (action.type) {
        case 'TRADE_ADD':
            var newTrades = [state.tradeData, action.data];
            return {
                ...state,
                tradeData: newTrades
            }
        case 'PRODUCT_SWITCH':
            return {
                selectedProduct: action.data,
                tradeData: []
            }
        default:
        return state;
    }
}