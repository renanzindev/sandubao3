import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductModal = ({ product, isOpen, onClose, addToCart }) => {
  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    addToCart(product.name, product.price, product.image);
    console.log(`Produto adicionado ao carrinho: ${product.name} - ID: ${product.name}`);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative animate-fade-in shadow-2xl">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 shadow-lg"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
          {/* Imagem do produto - Ampliada e mais próxima */}
          <div className="flex justify-center items-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <div className="relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-lg h-auto rounded-xl shadow-2xl object-cover transform transition-transform duration-300 group-hover:scale-105"
                style={{ minHeight: '300px', maxHeight: '500px' }}
              />
              {/* Efeito de brilho na imagem */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Badge de destaque */}
              <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                👁️ Visualização Ampliada
              </div>
            </div>
          </div>

          {/* Informações do produto */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Preço */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Preço</span>
              <p className="text-3xl font-bold text-green-600">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Descrição detalhada */}
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-semibold text-gray-800 mb-2">🍔 Ingredientes:</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Botão adicionar ao carrinho */}
            <button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>Adicionar ao Carrinho</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Estilos CSS personalizados */}
      <style>{`
        .animate-fade-in {
          animation: fadeInScale 0.3s ease-out forwards;
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductModal;