import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import ProductModal from "./components/ProductModal";
import Footer from "./components/Footer";
import Bebidas from "./pages/Bebidas";
import Combos from "./pages/Combos";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import Loading from "./components/Loading";
import products from './data/products';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [customerName, setCustomerName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Simula carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Carrega dados do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sandubao_cart');
    const savedFavorites = localStorage.getItem('sandubao_favorites');
    const savedCustomerName = localStorage.getItem('sandubao_customer_name');
    const savedAddress = localStorage.getItem('sandubao_address');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
    
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
    
    if (savedCustomerName) {
      setCustomerName(savedCustomerName);
    }
    
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  // Salva dados no localStorage
  useEffect(() => {
    localStorage.setItem('sandubao_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sandubao_favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    if (customerName) {
      localStorage.setItem('sandubao_customer_name', customerName);
    }
  }, [customerName]);

  useEffect(() => {
    if (address) {
      localStorage.setItem('sandubao_address', address);
    }
  }, [address]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };
  
  const addToCart = (name, price, image) => {
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      showToast(`Quantidade de ${name} aumentada!`, "success");
    } else {
      setCart([...cart, { name, price, image, quantity: 1 }]);
      showToast(`${name} adicionado ao carrinho!`, "success");
    }
  };

  const removeFromCart = (name) => {
    const item = cart.find((item) => item.name === name);
    if (item) {
      setCart(cart.filter((item) => item.name !== name));
      showToast(`${item.name} removido do carrinho`, "info");
    }
  };

  const updateCartQuantity = (name, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(name);
      return;
    }
    
    setCart(
      cart.map((item) =>
        item.name === name
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast("Carrinho limpo!", "info");
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        showToast("Removido dos favoritos", "info");
      } else {
        newFavorites.add(productId);
        showToast("Adicionado aos favoritos!", "success");
      }
      return newFavorites;
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loading 
          size="xlarge" 
          text="Preparando o melhor sabor para você..." 
          color="yellow" 
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        
        <main className="pb-32">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProductList 
                  products={products} 
                  addToCart={addToCart} 
                  onProductClick={openProductModal}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              } 
            />
            <Route 
              path="/bebidas" 
              element={
                <Bebidas 
                  addToCart={addToCart} 
                  onProductClick={openProductModal}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  showToast={showToast}
                />
              } 
            />
            <Route 
              path="/combos" 
              element={
                <Combos 
                  addToCart={addToCart} 
                  onProductClick={openProductModal}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  showToast={showToast}
                />
              } 
            />
          </Routes>
        </main>

        <Footer 
          cart={cart} 
          onCartClick={() => setIsCartOpen(true)} 
        />
        
        <BottomNav />

        {isCartOpen && (
          <CartModal
            cart={cart}
            closeModal={() => setIsCartOpen(false)}
            removeFromCart={removeFromCart}
            calculateTotal={calculateTotal}
            checkout={() => console.log('Checkout')}
            address={address}
            setAddress={setAddress}
            addressWarn={false}
            incrementItem={(name) => {
              const item = cart.find(item => item.name === name);
              if (item) {
                updateCartQuantity(name, item.quantity + 1);
              }
            }}
            decrementItem={(name) => {
              const item = cart.find(item => item.name === name);
              if (item) {
                updateCartQuantity(name, item.quantity - 1);
              }
            }}
            customerName={customerName}
            setCustomerName={setCustomerName}
          />
        )}

        {isProductModalOpen && selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={closeProductModal}
            onAddToCart={addToCart}
            isFavorite={favorites.has(selectedProduct.id)}
            onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
            showToast={showToast}
          />
        )}

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      </div>
    </Router>
  );
}

export default App;
