import React from "react";

const CartModal = ({ cart, closeModal, removeFromCart, calculateTotal, checkout, address, setAddress, addressWarn, incrementItem, customerName, decrementItem, setCustomerName}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[85vh] md:max-h-[80vh] overflow-y-auto shadow-2xl">
        <h2 className="text-center font-bold text-xl md:text-2xl mb-3 md:mb-4">Meu Carrinho</h2>

        <div>
        {cart.map((item, index) => (
            <div
              key={index}
              className="bg-stone-200 border border-gray-200 shadow-sm rounded-md p-3 md:p-4 mb-3 md:mb-4"
            >
              <div className="flex gap-2 md:gap-4 items-center">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-bold text-sm md:text-lg">{item.name}</p>
                  <p className="text-xs md:text-sm text-gray-600">Preço unitário: R$ {item.price.toFixed(2)}</p>
                  <p className="text-xs md:text-sm text-gray-600">Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => decrementItem(item.name)}
                      className="bg-gray-200 px-1.5 md:px-2 rounded text-sm md:text-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-xs md:text-sm font-medium px-1">{item.quantity}</span>
                    <button
                      onClick={() => incrementItem(item.name)}
                      className="bg-gray-200 px-1.5 md:px-2 rounded text-sm md:text-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="font-bold mt-3 md:mt-4 text-lg md:text-xl">Total: R$ {calculateTotal().toFixed(2)}</p>

        <p className="font-bold mt-3 md:mt-4 text-sm md:text-base">Nome do cliente:</p>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border-2 p-2 md:p-3 rounded my-1 md:my-2 border-gray-300 text-sm md:text-base"
          />

        <p className="font-bold mt-3 md:mt-4 text-sm md:text-base">Endereço de entrega:</p>
        <input
          type="text"
          placeholder="Digite seu endereço completo"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`w-full border-2 p-2 md:p-3 rounded my-1 md:my-2 text-sm md:text-base ${
            addressWarn ? "border-red-500" : "border-gray-300"
          }`}
        />
        {addressWarn && (
          <p className="text-red-500 text-sm mt-1">Por favor, informe um endereço válido.</p>
        )}

        <div className="flex items-center justify-between mt-4 md:mt-6 gap-3">
          <button onClick={closeModal} className="text-red-500 hover:text-red-700 hover:underline text-sm md:text-base font-medium">
             Fechar
           </button>
          <button
            onClick={checkout}
            className="bg-green-500 text-white px-3 md:px-4 py-2 md:py-2 rounded text-sm md:text-base hover:bg-green-600 transition-colors"
          >
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

