import React, { useState } from "react";
import ProductModal from "../components/ProductModal";
import cocacolaImg from "../assets/refri-coca.png";
import guaranaImg from "../assets/refri-guarana.png";
import fantaImg from "../assets/FantaLaranja.png";
import CocaCola2L from "../assets/cocaCola2Litros.png"
import Soda2L from "../assets/Soda2L.png"
import GuaranaAntartica from "../assets/GuaranaAntartica.png"
import AguaGas from "../assets/AguaGas.png"
import CocaZero from "../assets/CocaCola2LZero.png"



const Bebidas = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  // const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  // addToCart function removed - handled by parent component

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  const bebidas = [
    {
      name: "Coca-Cola (Lata)",
      description: "Refrigerante de 350ml.",
      price: 6.0,
      image: cocacolaImg,
    },
    {
      name: "Guaraná (Lata)",
      description: "Refrigerante de 350ml.",
      price: 5.0,
      image: guaranaImg,
    },
    {
      name: "Fanta Laranja (Lata)",
      description: "Refrigerante de 350ml.",
      price: 5.0,
      image: fantaImg,
    },
    {
      name: "Coca-Cola (2L)",
      description: "Refrigerante de 2L.",
      price: 13.0,
      image: CocaCola2L,
    },
    {
      name: "Soda (2L)",
      description: "Refrigerante de 2L.",
      price: 10.0,
      image: Soda2L,
    },
    {
      name: "Guarana Antartica (2L)",
      description: "Refrigerante de 2L.",
      price: 12.0,
      image: GuaranaAntartica,
    },
    {
      name: "Agua com Gás (500ml)",
      description: "Água mineral com gás de 500ml.",
      price: 4.0,
      image: AguaGas,
    },
    {
      name: "Coca-Cola Zero (2L)",
      description: "Refrigerante de 2L.",
      price: 13.0,
      image: CocaZero,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2">
      <h2 className="text-3xl font-bold my-4">Bebidas</h2>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
        {bebidas.map((bebida, index) => (
          <div className="flex gap-2" key={index}>
            <img
              src={bebida.image}
              alt={bebida.name}
              className="w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration-200 cursor-pointer"
              onClick={() => openProductModal(bebida)}
            />
            <div className="w-full">
              <p className="font-bold">{bebida.name}</p>
              <p className="text-sm">{bebida.description}</p>
              <div className="flex items-center gap-2 justify-between mt-3">
                <p className="font-bold text-lg">R$ {bebida.price.toFixed(2)}</p>
                <button
                  className="bg-gray-900 px-5 rounded"
                  onClick={() => console.log('Add to cart:', bebida.name)}
                >
                  <i className="fa fa-cart-plus text-lg text-white"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
      
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}
      
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        addToCart={() => console.log('Add to cart from modal')}
      />
    </div>
  );
};

export default Bebidas;
