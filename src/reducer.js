const initialState = {
    selectedProduct: "BTC-USD",
    tradeData: []
}
  
  // Use the initialState as a default value
  export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      case 'productSwitch': 
      {
        return {
            ...initialState,
            selectedProduct: action.payload.product,
            tradeData: []
        };
      }
      case 'addTrade': {
          const newTradeData = [...initialState.tradeData, action.payload.trade];
          return {
            ...initialState,
            tradeData: newTradeData
          }
      }
      // Do something here based on the different types of actions
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }