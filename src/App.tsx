import { useState } from 'react'
import { ProductData, CartProductData } from './types';
import { CartContextProvider, UseCartContext } from './stores/CartContext';
import { ProductDataBase } from './ProductsDatabase';

function App() {
  return (
    <CartContextProvider>
      <Store />
    </CartContextProvider>
  )
}

function Store() {
  return (
    <div>
      <CartModal />
      <CartWidget />
      {
        ProductDataBase.map( product => (
          <Product id={product.id} name={product.name} price={product.price} />
        ))
      }
    </div>
  )
}

function Product(props: ProductData) {
  const { id, name, price } = props;
  
  const cart = UseCartContext();

  if (cart == null)
    return;
  
  return (
    <div>
      <h3>{name}</h3>
      <p>{price}</p>
      <button onClick={() => cart.addToCart(id)}>Add to cart</button>
    </div>
  )
}

function CartWidget() {
  const cart = UseCartContext();

  if (cart == null)
    return;

  return (
    <div>
      <p>Total price: {cart.totalPrice}</p>
      <p>{cart.productsQtd} products in the cart.</p>
    </div>
  )
}

function CartModal() {
  const cart = UseCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (cart == null)
    return;

  return (
    <div>
      <button onClick={() => setIsCartOpen(true)}>Abrir Carrinho</button>
      {
        isCartOpen && (
          <div style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            top: 0,
            left: 0,
            backdropFilter: 'blur(4px)'
            
          }}>
            <button onClick={() => setIsCartOpen(false)}>Fechar Carrinho</button>
            <div>
              <h2>Produtos:</h2>
              <div>
                {
                  Object.keys(cart.cartTracker).map((productId) => {
                    const productTracking = cart.cartTracker[productId];
                    return <CartProduct id={productTracking.id} qtd={productTracking.qtd} />
                  })
                }
              </div>
            </div>
            <div>Total: {cart.totalPrice}</div>
          </div>
        )
      }      
    </div>
  )
}

function CartProduct(props: CartProductData) {
  const { id, qtd } = props; 
  const { name, price } = ProductDataBase.find(product => product.id === id)!;

  const cart = UseCartContext();

  if (cart == null)
    return;
  
  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.25)"
    }}>
      <div>
        <h3>{name}</h3>
        <p>{price}</p>
      </div>
      <div>
        <span>{qtd}</span>
        <div>
          <button onClick={() => cart.removeFromCart(id)}>-</button>
          <button onClick={() => cart.addToCart(id)}>+</button>
        </div>
      </div>
    </div>
  )
}

export default App
