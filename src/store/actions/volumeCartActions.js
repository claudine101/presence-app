import { ADD_COMMAND_ACTION, REMOVE_COMMAND_ACTION, RESET_CART_ACTION } from "../reducers/volumeCartReducer"


export const addVolumeAction = (product) => {
          return {
                    type: ADD_COMMAND_ACTION,
                    payload: { ...product}
          }
}
export const removeVolumeAction = (ID_PRODUIT) => {
          return {
                    type: REMOVE_COMMAND_ACTION,
                    payload: ID_PRODUIT
          }
}

export const resetCartAction = () => {
          return {
                    type: RESET_CART_ACTION
          }
}