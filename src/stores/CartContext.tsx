import { ReactNode, createContext, useContext, useState } from "react";
import { ICartContext, CartProductData } from "../types";
import { ProductDataBase } from "../ProductsDatabase";

const CartContext = createContext<ICartContext|null>(null);

export function CartContextProvider({children}: { children: ReactNode}) {
  const [cartTracker, setCartTracker] = useState<{[key: string]: CartProductData}>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsQtd, setProductsQtd] = useState(0);

  function updateCartData(currentCartTracker = cartTracker) {
    let price = 0;
    let qtd = 0;

    for (const productId in currentCartTracker) {
      const product = ProductDataBase.find(p => p.id === Number(productId))!;
      const qtdInCart = currentCartTracker[productId].qtd;

      price += (product.price*qtdInCart);
      qtd += qtdInCart;
    }

    setTotalPrice(price);
    setProductsQtd(qtd);
  }

  function addToCart(productId: number) {
    setCartTracker(current => {
      let update = current;

      if (current[productId] != null) {
        update =  {
          ...current,
          [productId]: {
            id: productId,
            qtd: current[productId].qtd+1
          }
        };
      }
      else {
        update =  {
          ...current,
          [productId]: {
            id: productId,
            qtd: 1
          }
        }
      }

      updateCartData(update)

      return update
    })
  }

  function removeFromCart(productId: number) {
    setCartTracker(current => {
      if (current[productId] == null) {
        return current
      }
      let update = current;

      if (current[productId].qtd === 1) {
        delete current[productId]
        update = {...current};
      }
      else {
        update = {
          ...current,
          [productId]: {
            id: productId,
            qtd: current[productId].qtd-1
          }
        };
      }

      updateCartData(update)

      return update

    });
  }

  return (
    <CartContext.Provider value={{
      cartTracker,
      addToCart,
      removeFromCart,
      totalPrice, productsQtd
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const UseCartContext = () => useContext(CartContext);