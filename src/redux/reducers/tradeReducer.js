const INITIAL_STATE = {
    selectedProduct: "BTC-USD"
}
  
export default function trade(state = INITIAL_STATE, action) {
    console.log(action.type);
    switch (action.type) {
        case 'PRODUCT_SWITCH':
            return {
                selectedProduct: action.data,
            }
        default:
        return state;
    }
}