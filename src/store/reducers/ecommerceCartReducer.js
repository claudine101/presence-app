export const ADD_COMMAND_ACTION = 'ADD_COMMAND_ACTION'
export const REMOVE_COMMAND_ACTION = 'REMOVE_COMMAND_ACTION'
export const RESET_CART_ACTION = 'RESET_CART_ACTION'

export function ecommerceCartReducer(products = [], action) {
          switch (action.type) {
                    case ADD_COMMAND_ACTION:
                              const product = products.find(command => command.ID_VOLUME == action.payload.ID_VOLUME)
                              if(product) {
                                        const newCommands = products.map(commande => {
                                                  if(commande.ID_VOLUME == product.ID_VOLUME) {
                                                            return {...commande, NUMERO_VOLUME: action.payload.NUMERO_VOLUME}
                                                  }
                                                  return commande
                                        })
                                        return newCommands
                              }
                              return [...products, action.payload]
                    case REMOVE_COMMAND_ACTION:
                              return products.filter((command, index) => command.ID_VOLUME != action.payload)
                    case RESET_CART_ACTION:
                              return []
                    default:
                              return products
          }
}