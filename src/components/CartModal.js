import React from "react";

const CartModal = ({ cart, closeModal, removeFromCart, calculateTotal, checkout, address, setAddress, addressWarn, incrementItem, customerName, decrementItem, setCustomerName}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-5 pb-32 rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-center font-bold text-2xl mb-2">Meu Carrinho</h2>

        {/* Lista de Itens no Carrinho */}
        <div>
        {cart.map((item, index) => (
            <div
              key={index}
              className="bg-stone-200 border border-gray-200 shadow-sm rounded-md p-4 mb-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600">Preço unitário: R$ {item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementItem(item.name)}
                      className="bg-gray-200 px-2 rounded text-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => incrementItem(item.name)}
                      className="bg-gray-200 px-2 rounded text-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <p className="font-bold mt-4">Total: R$ {calculateTotal().toFixed(2)}</p>

        <p className="font-bold mt-4">Nome do cliente:</p>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border-2 p-1 rounded my-1 border-gray-300"
          />

        {/* Endereço */}
        <p className="font-bold mt-4">Endereço de entrega:</p>
        <input
          type="text"
          placeholder="Digite seu endereço completo"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`w-full border-2 p-1 rounded my-1 ${
            addressWarn ? "border-red-500" : "border-gray-300"
          }`}
        />
        {addressWarn && (
          <p className="text-red-500 text-sm mt-1">Por favor, informe um endereço válido.</p>
        )}

        {/* Botões de Fechar e Finalizar Pedido */}
        <div className="flex items-center justify-between mt-5 ">
          <button onClick={closeModal} className="text-gray-500 hover:underline">
            Fechar
          </button>
          <button
            onClick={checkout}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

