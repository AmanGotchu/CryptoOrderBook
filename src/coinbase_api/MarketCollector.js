/* eslint-disable no-undef */
import axios from 'axios';
import crypto from 'crypto';
import Buffer from 'buffer';

export const getProducts = () => {
    const secret = process.env.REACT_APP_COINBASE_PRIVATE;
    var requestPath = '/products';
    var endpoint = "https://api-public.sandbox.pro.coinbase.com" + requestPath;

    const timestamp = Date.now()/1000;

    const body = JSON.stringify({});
    const method = 'GET';
    var what = timestamp + method + requestPath + body;
    var key = Buffer.Buffer(secret, 'base64');
    var hmac = crypto.createHmac('sha256', key);

    var CB_ACCESS_SIGN = hmac.update(what).digest('base64');
    var CB_ACCESS_KEY = process.env.REACT_APP_COINBASE_PRIVATE;
    var CB_ACCESS_TIMESTAMP = timestamp;
    var CB_ACCESS_PASSPHRASE = process.env.REACT_APP_COINBASE_PASSPHRASE;

    const headers = {
        headers: {
            'CB-ACCESS-KEY': CB_ACCESS_KEY,
            'CB-ACCESS-SIGN': CB_ACCESS_SIGN,
            'CB-ACCESS-TIMESTAMP': CB_ACCESS_TIMESTAMP,
            'CB-ACCESS-PASSPHRASE': CB_ACCESS_PASSPHRASE,
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };

    console.log(headers);

    axios.get(endpoint, headers).
        then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
}

export default getProducts;