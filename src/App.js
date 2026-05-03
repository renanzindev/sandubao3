import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cabecalho from "./components/Cabecalho";
import ProductList from "./components/ProductList";
import ModalCarrinho from "./components/ModalCarrinho";
import ProductModal from "./components/ProductModal";
import PaymentModal from "./components/PaymentModal";
import Rodape from "./components/Rodape";
import Bebidas from "./pages/Bebidas";
import Combos from "./pages/Combos";
import CustomSandwich from "./pages/CustomSandwich";
import NavegacaoInferior from "./components/NavegacaoInferior";
import Toast from "./components/Toast";
import Carregamento from "./components/Carregamento";
import products from './data/products';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [customerName, setCustomerName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [checkoutData, setCheckoutData] = useState(null);

  // comente 10
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

  const handleCheckout = (checkoutData) => {
    // Validações
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio!", "error");
      return;
    }

    if (!checkoutData.customerName.trim()) {
      showToast("Por favor, informe seu nome!", "error");
      return;
    }

    if (!checkoutData.address) {
      showToast("Por favor, selecione um endereço de entrega!", "error");
      return;
    }

    // Store checkout data for payment
    setCheckoutData(checkoutData);
    
    // Close cart modal and open payment modal
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handleWhatsAppCheckout = (paymentData) => {
    if (!checkoutData) {
      showToast("Erro: dados do pedido não encontrados", "error");
      return;
    }

    // Formatação da mensagem para WhatsApp
    let message = `🍔 *NOVO PEDIDO - SANDUBÃO* 🍔\n\n`;
    message += `👤 *Cliente:* ${checkoutData.customerName}\n`;
    
    // Formatação do endereço
    const address = checkoutData.address;
    message += `📍 *Endereço de Entrega:*\n`;
    message += `   ${address.street}, ${address.number}`;
    if (address.complement) message += ` - ${address.complement}`;
    message += `\n   ${address.neighborhood} - ${address.city}/${address.state}\n`;
    message += `   CEP: ${address.cep}\n`;
    if (address.reference) message += `   📍 Referência: ${address.reference}\n`;
    message += `\n`;
    message += `🛒 *ITENS DO PEDIDO:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    cart.forEach((item, index) => {
      const subtotal = (item.price * item.quantity).toFixed(2);
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Qtd: ${item.quantity}x | Preço: R$ ${item.price.toFixed(2)}\n`;
      message += `   Subtotal: R$ ${subtotal}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    // Resumo financeiro
    const subtotal = calculateTotal();
    message += `💰 *Subtotal dos itens:* R$ ${subtotal.toFixed(2)}\n`;
    
    // Informações de entrega
    if (checkoutData.deliveryInfo) {
      const delivery = checkoutData.deliveryInfo;
      if (delivery.isFreeDelivery) {
        message += `🚚 *Entrega:* GRÁTIS\n`;
      } else {
        message += `🚚 *Taxa de entrega:* R$ ${delivery.fee.toFixed(2)}\n`;
      }
      message += `📍 *Zona:* ${delivery.zone}\n`;
      message += `⏱️ *Tempo estimado:* ${delivery.estimatedTime}\n`;
    }
    
    // Adicionar informações de desconto se houver cupom
    if (paymentData.coupon) {
      message += `🎟️ *Cupom:* ${paymentData.coupon.code} (-${paymentData.coupon.type === 'percentage' ? paymentData.coupon.discount + '%' : 'R$ ' + paymentData.coupon.discount.toFixed(2)})\n`;
    }
    
    message += `💰 *TOTAL DO PEDIDO: R$ ${paymentData.finalTotal.toFixed(2)}*\n\n`;
    
    // Adicionar informações de pagamento
    message += `💳 *FORMA DE PAGAMENTO:* ${paymentData.method}\n`;
    if (paymentData.method === 'Dinheiro' && paymentData.cashAmount) {
      message += `💵 *Troco para:* R$ ${paymentData.cashAmount.toFixed(2)}\n`;
      message += `💰 *Troco:* R$ ${paymentData.change.toFixed(2)}\n`;
    }
    message += `\n⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `Obrigado pela preferência! 😊`;

    // Número do WhatsApp do estabelecimento
    const phoneNumber = "5531971659344"; // Formato: código do país + DDD + número
    
    // URL do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Limpar carrinho e fechar modais
    setCart([]);
    setIsCartOpen(false);
    setIsPaymentOpen(false);
    setCustomerName("");
    setAddress("");
    
    showToast("Pedido enviado para o WhatsApp! 🎉", "success");
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
        <Carregamento 
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
        <Cabecalho />
        
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
            <Route 
              path="/custom" 
              element={
                <CustomSandwich 
                  addToCart={addToCart} 
                  showToast={showToast}
                />
              } 
            />
          </Routes>
        </main>

        <Rodape 
          cart={cart} 
          onCartClick={() => setIsCartOpen(true)} 
        />
        
        <NavegacaoInferior />

        {isCartOpen && (
          <ModalCarrinho
            cart={cart}
            closeModal={() => setIsCartOpen(false)}
            removeFromCart={removeFromCart}
            calculateTotal={calculateTotal}
            checkout={handleCheckout}
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
            showToast={showToast}
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

        {isPaymentOpen && checkoutData && (
          <PaymentModal
            isOpen={isPaymentOpen}
            cart={cart}
            total={calculateTotal()}
            checkoutData={checkoutData}
            onClose={() => setIsPaymentOpen(false)}
            onPaymentComplete={handleWhatsAppCheckout}
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
