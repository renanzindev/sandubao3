import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faClock, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleWhatsAppContact = () => {
    const phoneNumber = "5531971659344"; // Formato internacional
    const message = "Olá! Gostaria de fazer um pedido no Sandubão 🍔";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg relative mb-6">
      <div className="container mx-auto px-4">
        {/* Logo e Menu Mobile */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl animate-bounce">🍔</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Sandubão</h1>
              <p className="text-xs md:text-sm opacity-90 hidden md:block">Sabor que conquista!</p>
            </div>
          </div>
          
          {/* Botão Menu Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
            aria-label="Abrir menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
          
          {/* Botão WhatsApp Desktop */}
          <button
            onClick={handleWhatsAppContact}
            className="hidden md:flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            aria-label="Entrar em contato via WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
            <span className="font-medium">Contato</span>
          </button>
        </div>
        
        {/* Informações da Loja - Desktop */}
        <div className="hidden md:flex justify-center items-center space-x-8 pb-4 text-sm">
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg backdrop-blur-sm">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-200" />
            <span className="font-medium">R. Dorotéia Thompson, 211- Chácaras Califórnia</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg backdrop-blur-sm">
            <FontAwesomeIcon icon={faPhone} className="text-yellow-200" />
            <span className="font-medium">(31) 97165-9344</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg backdrop-blur-sm">
            <FontAwesomeIcon icon={faClock} className="text-yellow-200" />
            <span className="font-medium">Seg-Dom: 18h às 23h</span>
          </div>
        </div>
        
        {/* Menu Mobile */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 space-y-3">
            <div className="flex items-center space-x-3 bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-200 text-lg" />
              <div>
                <p className="font-medium text-sm">Endereço</p>
                <p className="text-xs opacity-90">R. Dorotéia Thompson, 211- Chácaras Califórnia</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
              <FontAwesomeIcon icon={faPhone} className="text-yellow-200 text-lg" />
              <div>
                <p className="font-medium text-sm">Telefone</p>
                <p className="text-xs opacity-90">(31) 97165-9344</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
              <FontAwesomeIcon icon={faClock} className="text-yellow-200 text-lg" />
              <div>
                <p className="font-medium text-sm">Horário</p>
                <p className="text-xs opacity-90">Seg-Dom: 18h às 23h</p>
              </div>
            </div>
            
            <button
              onClick={handleWhatsAppContact}
              className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 p-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              aria-label="Entrar em contato via WhatsApp"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
              <span className="font-medium">Entrar em Contato</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Indicador de Status */}
      <div className="absolute top-2 right-2 hidden md:block">
        <div className="flex items-center space-x-1 bg-green-500 px-2 py-1 rounded-full text-xs">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Aberto</span>
        </div>
      </div>
    </header>
  );
};

export default Header;