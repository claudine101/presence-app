export const ADD_FOLIO_ACTION = 'ADD_FOLIO_ACTION'
export const REMOVE_FOLIO_ACTION = 'REMOVE_FOLIO_ACTION'
export const RESET_FOLIO_ACTION = 'RESET_FOLIO_ACTION'

export function folioNatureCartReducer(products = [], action) {
          switch (action.type) {
                    case ADD_FOLIO_ACTION:
                              return [...products, action.payload]
                    case REMOVE_FOLIO_ACTION:
                              return products.filter((command, index) => index != action.payload)
                    case RESET_FOLIO_ACTION:
                              return []
                    default:
                              return products
          }
}