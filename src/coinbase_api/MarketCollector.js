/* eslint-disable no-undef */
import axios from 'axios';

const sendRequest = (endpoint) => {
    return axios.get(endpoint).
        then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        })
}

export const getProducts = () => {
    var tradePath = '/products'
    var endpoint = "https://api.pro.coinbase.com" + tradePath;

    return sendRequest(endpoint);
}

export const getTradeHistory = (pair) => {
    var tradePath = "/products/" + pair + "/trades"
    var endpoint = "https://api.pro.coinbase.com" + tradePath;

    return sendRequest(endpoint);
}