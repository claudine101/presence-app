export const ADD_FOLIODETAIL_ACTION = 'ADD_FOLIODETAIL_ACTION'
export const REMOVE_FOLIODETAIL_ACTION = 'REMOVE_FOLIODETAIL_ACTION'
export const RESET_FOLIODETAIL_ACTION = 'RESET_FOLIODETAIL_ACTION'

export function folioDetailsCartReducer(products = [], action) {
          switch (action.type) {
                    case ADD_FOLIODETAIL_ACTION:
                              return [...products, action.payload]
                    case REMOVE_FOLIODETAIL_ACTION:
                              return products.filter((command, index) => index != action.payload)
                    case RESET_FOLIODETAIL_ACTION:
                              return []
                    default:
                              return products
          }
}