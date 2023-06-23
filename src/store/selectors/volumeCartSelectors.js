export const volumeCartSelector = ({ volumeCart }) => volumeCart
export const volumeCartLengthSelector = ({ volumeCart }) => volumeCart.length
export const volumeProductSelector = ID_PRODUIT => ({ volumeCart }) => volumeCart.find(commande => commande.produit.ID_PRODUIT == ID_PRODUIT)