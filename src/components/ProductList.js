import React from "react";

const ProductList = ({ products, addToCart }) => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
      {products.map((product, index) => (
        <div className="flex gap-2" key={index}>
          <img
            src={product.image}
            alt={product.name}
            className="w-28 h-28 rounded-md ho hover:scale-110 hover:-rotate-2 duration-200"
          />
          <div className="w-full">
            <p className="font-bold">{product.name}</p>
            <p className="text-sm">{product.description}</p>
            <div className=" flex items-center gap-2 justify-between mt-3">
              <p className="font-bold text-lg">R$ {product.price.toFixed(2)}</p>
              <button
                className="bg-gray-900 px-5 rounded"
                onClick={() => addToCart(product.name, product.price, product.image)}
              >
                <i className="fa fa-cart-plus text-lg text-white"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default ProductList;
