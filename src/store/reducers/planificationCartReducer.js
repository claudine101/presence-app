export const ADD_PLANIFICATION_ACTION = 'ADD_PLANIFICATION_ACTION'
export const REMOVE_PLANIFICATION_ACTION = 'REMOVE_PLANIFICATION_ACTION'
export const RESET_PLANIFICATION_ACTION = 'RESET_PLANIFICATION_ACTION'

export function planificationCartReducer(products = [], action) {
          switch (action.type) {
                    case ADD_PLANIFICATION_ACTION:
                              return [...products, action.payload]
                    case REMOVE_PLANIFICATION_ACTION:
                              return products.filter((command, index) => index != action.payload)
                    case RESET_PLANIFICATION_ACTION:
                              return []
                    default:
                              return products
          }
}