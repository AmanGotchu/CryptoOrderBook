import { combineReducers } from 'redux';
import trade from './tradeReducer';

const rootReducer = combineReducers({
    trade
});

export default rootReducer;