import React from "react";

const Footer = ({ cartCount, openCart }) => {
  return (
    <div className="fixed bottom-20 w-full flex justify-center z-50 px-4">
      <button
        onClick={openCart}
        aria-label="Abrir carrinho"
        className="bg-red-500 text-white font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        (<span>{cartCount}</span>) Veja meu carrinho
        <i className="fa fa-cart-plus"></i>
      </button>
    </div>
  );
};

export default Footer;
