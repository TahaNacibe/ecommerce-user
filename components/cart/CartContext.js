import { createContext, useState } from "react";


export const CartContext = createContext({})

export function CartContextProvider({ children }) {
    const [cartProducts, setCartProducts] = useState([])

    //* check if the product is in the cart already
    function isProductInTheCart(productId) {
        if (typeof productId != "string") {
            productId = productId.productId
        }
        return cartProducts.includes(productId)
    }

    //* handle the add action for the product in the cart
    function changeProductStateInCart(productId, actionIsAdd = true) {
        if (typeof productId != "string") {
            productId = productId.productId
        }
        if (actionIsAdd) {
            setCartProducts(prev => [...prev, productId])
        } else {
            setCartProducts(prev => {
                const pos = prev.indexOf(productId)
                if (pos !== -1) {
                    return prev.filter((value, index) => index != pos)
                }
                return prev
            })
        }
    }

    //* handle the delete for the items from the cart
    function removeProductFromCart(productId) {
        if (typeof productId != "string") {
            productId = productId.productId
        }
        const newList = cartProducts.filter(id => id !== productId);
        setCartProducts(newList);
    }

    //* how many of it in the cart
    function getItemCountInTheCart(productId) {
        return cartProducts.filter(id => id === productId).length ?? 0
    }

    //* return the wrapper
    return (
        <CartContext.Provider value={{cartProducts, setCartProducts, isProductInTheCart,changeProductStateInCart, removeProductFromCart, getItemCountInTheCart}} >
            {children}
        </CartContext.Provider>
    )
}