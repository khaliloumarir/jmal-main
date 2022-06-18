import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
const sessionReducer = (session = "", action) => {
  switch (action.type) {
    case "CREATE_SESSION": {
      return action.payload;
    }
    default:
      return session;
  }
};
const clientReducer = (client = null, action) => {
  switch (action.type) {
    case "CREATE_CLIENT": {
      return action.payload;
    }
    default:
      return client;
  }
};

// const authReducer = (state = {}, action) => {
//   switch (action.type) {
//     case "LOGIN_SUCCESS": {
//     }
//     case "LOGIN_ERROR": {
//       //you can use action.payload later, cus its populated with err
//       // return {...state,error:"Login Failed"}
//     }
//     default: return state
//   }

// };

const productReducer = (product = {}, action) => {
  switch (action.type) {
    case "CREATE_PRODUCT": {
      return action.payload;
    }
    default:
      return product;
  }
};

const combinedReducers = combineReducers({
  session: sessionReducer,
  client: clientReducer,
  firebase: firebaseReducer,
  fireStore: firestoreReducer,
  product: productReducer,
});
export default combinedReducers;
