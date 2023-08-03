export const ADD_FOLIOPREPARATION_ACTION = 'ADD_FOLIOPREPARATION_ACTION'
export const REMOVE_FOLIOPREPARATION_ACTION = 'REMOVE_FOLIOPREPARATION_ACTION'
export const RESET_FOLIOPREPARATION_ACTION = 'RESET_FOLIOPREPARATION_ACTION'

export function folioPreparationCartReducer(products = [], action) {
          switch (action.type) {
                    case ADD_FOLIOPREPARATION_ACTION:
                              return [...products, action.payload]
                    case REMOVE_FOLIOPREPARATION_ACTION:
                              return products.filter((command, index) => index != action.payload)
                    case RESET_FOLIOPREPARATION_ACTION:
                              return []
                    default:
                              return products
          }
}