import React from "react";

const CartModal = ({ cart, closeModal, removeFromCart, calculateTotal, checkout, address, setAddress, addressWarn }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-md w-full max-w-md">
        <h2 className="text-center font-bold text-2xl mb-2">Meu Carrinho</h2>

        {/* Lista de Itens no Carrinho */}
        <div>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p>Quantidade: {item.quantity}</p>
                <p className="font-medium mt-2">R$ {item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.name)} // Função de Remoção
                className="text-red-500 font-bold hover:underline"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        {/* Total */}
        <p className="font-bold mt-4">Total: R$ {calculateTotal().toFixed(2)}</p>

        {/* Endereço */}
        <p className="font-bold mt-4">Endereço de entrega:</p>
        <input
          type="text"
          placeholder="Digite seu endereço completo"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`w-full border-2 p-1 rounded my-1 ${
            addressWarn ? "border-red-500" : ""
          }`}
        />
        {addressWarn && (
          <p className="text-red-500 text-sm">Digite seu endereço completo!</p>
        )}

        {/* Botões de Fechar e Finalizar Pedido */}
        <div className="flex items-center justify-between mt-5">
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

