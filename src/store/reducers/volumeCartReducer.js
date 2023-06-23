export const ADD_COMMAND_ACTION = 'ADD_COMMAND_ACTION'
export const REMOVE_COMMAND_ACTION = 'REMOVE_COMMAND_ACTION'
export const RESET_CART_ACTION = 'RESET_CART_ACTION'

export function volumeCartReducer(volumes = [], action) {
          switch (action.type) {
                    case ADD_COMMAND_ACTION:
                              const product = volumes.find(command => command.produit.ID_PRODUIT == action.payload.produit.ID_PRODUIT)
                              if(product) {
                                        const newCommands = volumes.map(commande => {
                                                  if(commande.produit.ID_PRODUIT == product.produit.ID_PRODUIT) {
                                                            return {...commande, QUANTITE: action.payload.QUANTITE, combinaison: action.payload.combinaison}
                                                  }
                                                  return commande
                                        })
                                        return newCommands
                              }
                              return [...volumes, action.payload]
                    case REMOVE_COMMAND_ACTION:
                              return volumes.filter((command, index) => command.produit.ID_PRODUIT != action.payload)
                    case RESET_CART_ACTION:
                              return []
                    default:
                              return volumes
          }
}