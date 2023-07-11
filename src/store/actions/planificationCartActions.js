import { ADD_PLANIFICATION_ACTION, REMOVE_PLANIFICATION_ACTION, RESET_PLANIFICATION_ACTION } from "../reducers/planificationCartReducer"


export const addVolumeAction = (product) => {
          return {
                    type: ADD_PLANIFICATION_ACTION,
                    payload: { ...product}
          }
}
export const removeVolumeAction = (ID_VOLUME) => {
          return {
                    type: REMOVE_PLANIFICATION_ACTION,
                    payload: ID_VOLUME
          }
}

export const resetCartAction = () => {
          return {
                    type: RESET_PLANIFICATION_ACTION
          }
}