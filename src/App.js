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
  const [toastMessage, setToastMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  
  const addToCart = (name, price, image) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { name, price, image, quantity: 1 }];
      }
    });
  
  setToastMessage(`${name} adicionado ao carrinho!`);
  setTimeout(() => setToastMessage(""), 2000);
  
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


  const incrementItem = (name) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };


  const decrementItem = (name) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = () => {
    if (
      cart.length === 0 ||
      address.trim() === "" ||
      customerName.trim() === ""
    ) {
      setAddressWarn(true);
      return;
    }
  
    const cartItems = cart
      .map(
        (item) =>
          `🍔 *${item.name}*\nQuantidade: ${item.quantity}\nPreço: R$ ${item.price.toFixed(2)}\n`
      )
      .join("\n");

      const total = calculateTotal(); // 👈 calcula o valor total

      const message = encodeURIComponent(
        `📦 *Novo Pedido - ${customerName}*\n\n${cartItems}` +
        `📍 *Endereço:* ${address}\n\n` +
        `💰 *Total:* R$ ${total.toFixed(2)}`
      );
    
      const phone = "31971539755";
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrder = {
        address,
        items: cart,
        customerName,
        date: new Date().toLocaleString(),
      };
      localStorage.setItem("orders", JSON.stringify([...savedOrders, newOrder]));


      setCart([]);
      setIsCartOpen(false);
      setCustomerName("");
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
        incrementItem={incrementItem}  
        decrementItem={decrementItem}  
        addressWarn={addressWarn}
        customerName={customerName}
        setCustomerName={setCustomerName}
      />
    )}
    {!isCartOpen && (
      <Footer cartCount={cart.length} openCart={() => setIsCartOpen(true)} />
    )}
      <BottomNav />

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
          {toastMessage}
          </div>
          )}
  </Router>
  );
};

export default App;
