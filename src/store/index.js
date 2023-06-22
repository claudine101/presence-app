import { combineReducers, createStore } from "redux";
import userReducer from "./reducers/userReducer";
import appReducer from "./reducers/appReducer";
export const store = createStore(
          combineReducers({
                    user: userReducer,
                    app: appReducer

       }),
)