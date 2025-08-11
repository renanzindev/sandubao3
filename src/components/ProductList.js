import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHeart, faEye } from "@fortawesome/free-solid-svg-icons";

const ProductList = ({ products, addToCart, onProductClick }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  
  const handleAddToCart = async (product) => {
    setLoadingStates(prev => ({ ...prev, [product.id]: true }));
    
    // Simula um pequeno delay para feedback visual
    setTimeout(() => {
      addToCart(product.name, product.price, product.image);
      setLoadingStates(prev => ({ ...prev, [product.id]: false }));
    }, 300);
  };
  
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };
  
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-gray-400 text-6xl mb-4">🍔</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
        <p className="text-gray-500 text-center">Não há produtos disponíveis no momento.</p>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
      {products.map((product, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
              onClick={() => onProductClick(product)}
              loading="lazy"
            />
            
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => onProductClick(product)}
                  className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 transform hover:scale-110"
                  aria-label="Ver detalhes do produto"
                >
                  <FontAwesomeIcon icon={faEye} className="text-sm" />
                </button>
                <button
                  onClick={() => toggleFavorite(product.id || index)}
                  className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                    favorites.has(product.id || index)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                  aria-label="Adicionar aos favoritos"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-sm" />
                </button>
              </div>
            </div>
            
            {/* Badge de favorito */}
            {favorites.has(product.id || index) && (
              <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full animate-pulse">
                <FontAwesomeIcon icon={faHeart} className="text-xs" />
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={loadingStates[product.id || index]}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
                  loadingStates[product.id || index]
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg'
                } text-white`}
                aria-label={`Adicionar ${product.name} ao carrinho`}
              >
                {loadingStates[product.id || index] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
};

export default ProductList;
