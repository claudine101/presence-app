import { ADD_FOLIODETAIL_ACTION, REMOVE_FOLIODETAIL_ACTION, RESET_FOLIODETAIL_ACTION } from "../reducers/folioDetailsCartReducer"


export const addFolioDetailAction = (product) => {
          return {
                    type: ADD_FOLIODETAIL_ACTION,
                    payload: product
          }
}
export const removeFolioDetailAction = (ID_VOLUME) => {
          return {
                    type: REMOVE_FOLIODETAIL_ACTION,
                    payload: ID_VOLUME
          }
}

export const resetCartAction = () => {
          return {
                    type: RESET_FOLIODETAIL_ACTION
          }
}