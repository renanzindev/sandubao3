import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Rodape = ({ cart, onCartClick }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const handleSocialClick = (platform) => {
    const urls = {
      instagram: 'https://instagram.com/sandubao',
      facebook: 'https://facebook.com/sandubao',
      whatsapp: 'https://wa.me/5531971659344?text=Olá! Gostaria de saber mais sobre o Sandubão 🍔'
    };
    
    window.open(urls[platform], '_blank');
  };

  return (
    <>
      {/* Rodapé principal */}
      <footer className="bg-gray-900 text-white ">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Informações da Empresa */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🍔</span>
                <h3 className="text-xl font-bold text-yellow-400">Sandubão</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                O melhor sabor da cidade! Sanduíches artesanais feitos com ingredientes frescos e muito amor.
              </p>
              <div className="flex space-x-3">
                <button
                   onClick={() => handleSocialClick('instagram')}
                   className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full hover:scale-110 transition-transform duration-200"
                   aria-label="Instagram"
                 >
                   <FontAwesomeIcon icon={faInstagram} className="text-white" />
                 </button>
                 <button
                   onClick={() => handleSocialClick('facebook')}
                   className="bg-blue-600 p-2 rounded-full hover:scale-110 transition-transform duration-200"
                   aria-label="Facebook"
                 >
                   <FontAwesomeIcon icon={faFacebook} className="text-white" />
                 </button>
                 <button
                   onClick={() => handleSocialClick('whatsapp')}
                   className="bg-green-500 p-2 rounded-full hover:scale-110 transition-transform duration-200"
                   aria-label="WhatsApp"
                 >
                   <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
                 </button>
              </div>
            </div>
            
            {/* Links Rápidos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Sanduíches</a></li>
                <li><a href="/bebidas" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Bebidas</a></li>
                <li><a href="/combos" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Combos</a></li>
                <li><span className="text-gray-300">Política de Privacidade</span></li>
                <li><span className="text-gray-300">Termos de Uso</span></li>
              </ul>
            </div>
            
            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Contato</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>📍 R. Dorotéia Thompson, 211</p>
                <p>Chácaras Califórnia</p>
                <p>📞 (31) 97165-9344</p>
                <p>🕒 Seg-Dom: 18h às 23h</p>
                <div className="flex items-center space-x-1 mt-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Aberto agora</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Sandubão. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Feito com</span>
                <FontAwesomeIcon icon={faHeart} className="text-red-500 animate-pulse" />
                <span>para você!</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Botão Carrinho Flutuante */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          <button
            onClick={onCartClick}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-bounce"
            aria-label="Abrir carrinho de compras"
          >
            <div className="relative">
              <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {totalItems}
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium">Meu carrinho</div>
              <div className="text-xs opacity-90">R$ {totalPrice.toFixed(2)}</div>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default Rodape;
