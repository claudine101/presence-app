export const ADD_PLANIFICATION_ACTION = 'ADD_PLANIFICATION_ACTION'
export const REMOVE_PLANIFICATION_ACTION = 'REMOVE_PLANIFICATION_ACTION'
export const RESET_PLANIFICATION_ACTION = 'RESET_PLANIFICATION_ACTION'

export function planificationCartReducer(products = [], action) {
          switch (action.type) {
                    case ADD_PLANIFICATION_ACTION:
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
                    case REMOVE_PLANIFICATION_ACTION:
                              return products.filter((command, index) => command.ID_VOLUME != action.payload)
                    case RESET_PLANIFICATION_ACTION:
                              return []
                    default:
                              return products
          }
}