
export interface CartProductData {
  id: number
  qtd: number
}

export interface ProductData {
  id: number
  name: string
  price: number
}

export interface ICartContext {
  cartTracker: {
      [key: string]: CartProductData;
  }
  addToCart(productId: number): void
  removeFromCart(productId: number): void
  totalPrice: number
  productsQtd: number
}
