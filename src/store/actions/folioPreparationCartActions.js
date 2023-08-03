import { ADD_FOLIOPREPARATION_ACTION, REMOVE_FOLIOPREPARATION_ACTION, RESET_FOLIOPREPARATION_ACTION } from "../reducers/folioPreparationCartReducer"


export const addFolioPreparationAction = (product) => {
          return {
                    type: ADD_FOLIOPREPARATION_ACTION,
                    payload: product
          }
}
export const removeFolioPreparationAction = (ID_VOLUME) => {
          return {
                    type: REMOVE_FOLIOPREPARATION_ACTION,
                    payload: ID_VOLUME
          }
}

export const resetCartAction = () => {
          return {
                    type: RESET_FOLIOPREPARATION_ACTION
          }
}