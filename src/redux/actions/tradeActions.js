// import axios from 'axios';

export function switchProduct(product) {
    return {
        type: 'PRODUCT_SWITCH',
        data: product
    }
}

export function dispatchSwitchProduct(product) {
    return dispatch => {
        dispatch(switchProduct(product))
    }
}


// export function isLoading(bool) {
//   return {
//     type: 'LOGIN_ATTEMPT',
//     isLoading: bool
//   };
// }

// export function loginSuccess(userData) {
//   return {
//     type: 'LOGIN_SUCCESS',
//     userData
//   };
// }

// export function loginFailed(error) {
//   return {
//     type: 'LOGIN_FAILED',
//     error
//   };
// }

// export function logoutComplete() {
//   return {
//     type: 'LOGOUT'
//   };
// }

// export function logout() {
//   return dispatch => {
//     dispatch(logoutComplete());
//     //Actions.replace('login');
//   };
// }

// export function login(data) {

//   return dispatch => {
//     // dispatch(isLoading(true));

//     return axios.post(
//       'https://register.tamuhack.com/volunteer/login',
//       {
//          email: data.email,
//          password: data.password,
//       },
//       {
//          headers: {
//            'content-type': 'application/json',
//          }
//       }
//     ).then(response => {
//       console.log(response);
//       dispatch(loginSuccess(response));
//     }).catch(error => {
//       console.log(error);
//       dispatch(loginFailed(error));
//     });
//   };
// }