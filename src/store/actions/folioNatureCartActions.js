import { ADD_FOLIO_ACTION, REMOVE_FOLIO_ACTION, RESET_FOLIO_ACTION } from "../reducers/folioNatureCartReducer"


export const addFolioAction = (product) => {
          return {
                    type: ADD_FOLIO_ACTION,
                    payload: product
          }
}
export const removeFolioAction = (ID_VOLUME) => {
          return {
                    type: REMOVE_FOLIO_ACTION,
                    payload: ID_VOLUME
          }
}

export const resetCartAction = () => {
          return {
                    type: RESET_FOLIO_ACTION
          }
}