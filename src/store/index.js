import { combineReducers, createStore } from "redux";
import { ecommerceCartReducer } from "./reducers/ecommerceCartReducer";

import userReducer from "./reducers/userReducer";
import appReducer from "./reducers/appReducer";


export const store = createStore(
          combineReducers({
                    user: userReducer,
                    ecommerceCart: ecommerceCartReducer,
                    app: appReducer

       }),
)