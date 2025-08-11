import React, { useState } from "react";
import ProductModal from "../components/ProductModal";
import hamb1 from "../assets/hamb1.jpg";
import hamb2 from "../assets/hamb-two.png";
import hamb3 from "../assets/hamb-3.png";
import hamb4 from "../assets/hamb-4.png";
// import cocacolaImg from "../assets/refri-coca.png";
// import guaranaImg from "../assets/refri-guarana.png";

const Combos = () => {
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

  const combos = [
    {
      name: "Combo X-Bacon",
      description: "X-Bacon suculento + Coca-Cola gelada (Lata 350ml) + Batata frita crocante",
      price: 25.0,
      image: hamb1,
    },
    {
      name: "Combo X-Tudo Turbo",
      description: "X-Tudo Turbo completo + Guaraná Antártica (Lata 350ml) + Batata frita especial",
      price: 30.0,
      image: hamb2,
    },
    {
      name: "Combo Baby Burguer",
      description: "Baby Burguer gourmet + Coca-Cola (Lata 350ml) + Onion rings crocantes",
      price: 32.0,
      image: hamb3,
    },
    {
      name: "Combo Gulosão",
      description: "Gulosão gigante + Guaraná (Lata 350ml) + Batata frita grande + Molho especial",
      price: 35.0,
      image: hamb4,
    },
    {
      name: "Combo Duplo",
      description: "2 X-Bacon + 2 Coca-Cola (Lata 350ml) + Batata frita família",
      price: 45.0,
      image: hamb1,
    },
    {
      name: "Combo Família",
      description: "3 Hambúrgueres variados + 3 Refrigerantes + Batata frita gigante + 2 Molhos",
      price: 65.0,
      image: hamb2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2">
      <h2 className="text-3xl font-bold my-4">🍔 Combos Especiais</h2>
      <p className="text-gray-600 mb-6 px-2">Economize com nossos combos! Hambúrguer + bebida + acompanhamento por um preço especial.</p>
      
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
        {combos.map((combo, index) => (
          <div className="flex gap-2" key={index}>
            <img
              src={combo.image}
              alt={combo.name}
              className="w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration-200 cursor-pointer"
              onClick={() => openProductModal(combo)}
            />
            <div className="w-full">
              <p className="font-bold">{combo.name}</p>
              <p className="text-sm text-gray-600">{combo.description}</p>
              <div className="flex items-center gap-2 justify-between mt-3">
                <p className="font-bold text-lg text-green-600">R$ {combo.price.toFixed(2)}</p>
                <button
                  className="bg-gray-900 px-5 rounded hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => console.log('Add to cart:', combo.name)}
                >
                  <i className="fa fa-cart-plus text-lg text-white"></i>
                </button>
              </div>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  💰 Economia garantida!
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>
      
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in">
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

export default Combos;
