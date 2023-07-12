import { combineReducers, createStore } from "redux";
import { planificationCartReducer } from "./reducers/planificationCartReducer";
import { folioNatureCartReducer } from "./reducers/folioNatureCartReducer";

import userReducer from "./reducers/userReducer";
import appReducer from "./reducers/appReducer";


export const store = createStore(
          combineReducers({
                    user: userReducer,
                    planificationCart: planificationCartReducer,
                    folioNatureCart: folioNatureCartReducer,
                    app: appReducer

       }),
)