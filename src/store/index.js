import { combineReducers, createStore } from "redux";
import { planificationCartReducer } from "./reducers/planificationCartReducer";
import { folioNatureCartReducer } from "./reducers/folioNatureCartReducer";
import { folioDetailsCartReducer } from "./reducers/folioDetailsCartReducer";
import { folioPreparationCartReducer } from "./reducers/folioPreparationCartReducer";

import userReducer from "./reducers/userReducer";
import appReducer from "./reducers/appReducer";


export const store = createStore(
          combineReducers({
                    user: userReducer,
                    planificationCart: planificationCartReducer,
                    folioNatureCart: folioNatureCartReducer,
                    folioDetailCart: folioDetailsCartReducer,
                    folioPreparationCart: folioPreparationCartReducer,
                    app: appReducer

       }),
)