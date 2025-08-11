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
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 shadow-lg"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
          {/* Imagem do produto */}
          <div className="flex justify-center items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
            />
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
    </div>
  );
};

export default ProductModal;