export const planificationCartSelector = ({ planificationCart }) => planificationCart
export const planificationCartLengthSelector = ({ planificationCart }) => planificationCart.length
export const planificationActititesSelector = ID_PRODUIT => ({ planificationCart }) => planificationCart.find(commande => commande.produit.ID_PRODUIT == ID_PRODUIT)