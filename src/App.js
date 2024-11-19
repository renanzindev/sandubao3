import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import Footer from "./components/Footer";
import Bebidas from "./pages/Bebidas";
import Combos from "./pages/Combos";
import BottomNav from "./components/BottomNav";
import products from "./data/products";



const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [addressWarn, setAddressWarn] = useState(false);

  const addToCart = (name, price) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { name, price, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (name) => {
    setCart((prevCart) =>
      prevCart.filter((item) =>
        item.name === name
          ? item.quantity > 1 // Mantém o item no carrinho se a quantidade for maior que 1
          : true // Mantém os outros itens
      ).map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity - 1 } // Decrementa a quantidade do item
          : item // Retorna os outros itens sem alterações
      )
    );
  };
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = () => {
    if (cart.length === 0 || address.trim() === "") {
      setAddressWarn(true);
      return;
      }

    const cartItems = cart
      .map(
        (item) =>
          `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(
            2
          )}`
      )
      .join("\n");

    const message = encodeURIComponent(`${cartItems}\nEndereço: ${address}`);
    const phone = "31971659344";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <Router>
    <Header />
    <div className='pb-16'>
    <Routes>
      <Route
        path="/"
        element={<ProductList products={products} addToCart={addToCart} />}
      />
      <Route path="/bebidas" element={<Bebidas />} />
      <Route path="/combos" element={<Combos />} />
    </Routes>
    </div>
    {isCartOpen && (
      <CartModal
        cart={cart}
        closeModal={() => setIsCartOpen(false)}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        checkout={checkout}
        address={address}
        setAddress={setAddress}
        addressWarn={addressWarn}
      />
    )}
    <Footer cartCount={cart.length} openCart={() => setIsCartOpen(true)} />
      <BottomNav />
  </Router>
  );
};

export default App;
