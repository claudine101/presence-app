import { ADD_COMMAND_ACTION, REMOVE_COMMAND_ACTION, RESET_CART_ACTION } from "../reducers/ecommerceCartReducer"


export const addVolumeAction = (product) => {
          return {
                    type: ADD_COMMAND_ACTION,
                    payload: { ...product}
          }
}
export const removeVolumeAction = (ID_VOLUME) => {
          return {
                    type: REMOVE_COMMAND_ACTION,
                    payload: ID_VOLUME
          }
}

export const resetCartAction = () => {
          return {
                    type: RESET_CART_ACTION
          }
}