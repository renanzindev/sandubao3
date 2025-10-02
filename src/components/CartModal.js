import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPlus, 
  faEdit,
  faTruck,
  faGift,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import AddressManager from './AddressManager';
import DeliveryService from '../services/deliveryService';
import { getSavedAddresses, formatAddressForDisplay } from '../utils/addressStorage';

const CartModal = ({ 
  cart, 
  closeModal, 
  removeFromCart, 
  calculateTotal, 
  checkout, 
  incrementItem, 
  customerName, 
  decrementItem, 
  setCustomerName,
  showToast 
}) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressManagerOpen, setIsAddressManagerOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [addressWarn, setAddressWarn] = useState(false);

  // Load default address on component mount
  useEffect(() => {
    const addresses = getSavedAddresses();
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, []);

  // Calculate delivery when address changes
  useEffect(() => {
    if (selectedAddress && selectedAddress.cep) {
      calculateDeliveryFee();
    } else {
      setDeliveryInfo(null);
    }
  }, [selectedAddress, cart]);

  const calculateDeliveryFee = async () => {
    if (!selectedAddress || !selectedAddress.cep) return;

    setIsCalculatingDelivery(true);
    
    try {
      const cartTotal = calculateTotal();
      const delivery = DeliveryService.calculateDeliveryFee(selectedAddress.cep, cartTotal);
      setDeliveryInfo(delivery);
      
      if (!delivery.success) {
        showToast && showToast(delivery.error, 'error');
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      showToast && showToast('Erro ao calcular frete', 'error');
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setAddressWarn(false);
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      setAddressWarn(true);
      showToast && showToast('Por favor, selecione um endereço de entrega', 'error');
      return;
    }

    if (!customerName.trim()) {
      showToast && showToast('Por favor, informe seu nome', 'error');
      return;
    }

    // Pass delivery info to checkout
    checkout({
      address: selectedAddress,
      deliveryInfo: deliveryInfo,
      customerName: customerName.trim()
    });
  };

  const getTotalWithDelivery = () => {
    const cartTotal = calculateTotal();
    const deliveryFee = deliveryInfo && deliveryInfo.success ? deliveryInfo.fee : 0;
    return cartTotal + deliveryFee;
  };
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

        {/* Customer Name */}
        <div className="mt-4">
          <p className="font-bold text-sm md:text-base mb-2">Nome do cliente:</p>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border-2 p-2 md:p-3 rounded border-gray-300 text-sm md:text-base"
          />
        </div>

        {/* Address Selection */}
        <div className="mt-4">
          <p className="font-bold text-sm md:text-base mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            Endereço de entrega:
          </p>
          
          {selectedAddress ? (
            <div className={`border-2 rounded p-3 ${
              addressWarn ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedAddress.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatAddressForDisplay(selectedAddress)}
                  </p>
                  {selectedAddress.reference && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {selectedAddress.reference}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsAddressManagerOpen(true)}
                  className="text-blue-500 hover:text-blue-600 ml-2"
                  title="Alterar endereço"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddressManagerOpen(true)}
              className={`w-full border-2 border-dashed p-4 rounded text-center transition-colors ${
                addressWarn 
                  ? 'border-red-500 text-red-500 bg-red-50' 
                  : 'border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-500'
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Selecionar endereço de entrega
            </button>
          )}
          
          {addressWarn && (
            <p className="text-red-500 text-sm mt-1">Por favor, selecione um endereço de entrega.</p>
          )}
        </div>

        {/* Delivery Information */}
        {selectedAddress && (
          <div className="mt-4">
            {isCalculatingDelivery ? (
              <div className="flex items-center justify-center p-3 bg-gray-50 rounded">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                <span className="text-sm">Calculando frete...</span>
              </div>
            ) : deliveryInfo && deliveryInfo.success ? (
              <div className={`p-3 rounded border ${
                deliveryInfo.freeDelivery 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={deliveryInfo.freeDelivery ? faGift : faTruck} 
                      className={deliveryInfo.freeDelivery ? 'text-green-500' : 'text-blue-500'} 
                    />
                    <span className="ml-2 text-sm font-medium">
                      {deliveryInfo.freeDelivery ? 'Frete Grátis!' : `Frete: R$ ${deliveryInfo.fee.toFixed(2)}`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    ⏱️ {deliveryInfo.estimatedTime}
                  </span>
                </div>
                {deliveryInfo.zone && (
                  <p className="text-xs text-gray-600 mt-1">
                    Zona de entrega: {deliveryInfo.zone}
                  </p>
                )}
              </div>
            ) : deliveryInfo && !deliveryInfo.success ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600 text-sm">
                  ⚠️ {deliveryInfo.error}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
          </div>
          
          {deliveryInfo && deliveryInfo.success && (
            <div className="flex justify-between text-sm mb-1">
              <span>Frete:</span>
              <span className={deliveryInfo.freeDelivery ? 'text-green-600 font-medium' : ''}>
                {deliveryInfo.freeDelivery ? 'Grátis' : `R$ ${deliveryInfo.fee.toFixed(2)}`}
              </span>
            </div>
          )}
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>R$ {getTotalWithDelivery().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 md:mt-6 gap-3">
          <button 
            onClick={closeModal} 
            className="text-red-500 hover:text-red-700 hover:underline text-sm md:text-base font-medium"
          >
            Fechar
          </button>
          <button
            onClick={handleCheckout}
            disabled={!selectedAddress || !customerName.trim()}
            className="bg-green-500 text-white px-3 md:px-4 py-2 md:py-2 rounded text-sm md:text-base hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Finalizar pedido
          </button>
        </div>
      </div>

      {/* Address Manager Modal */}
      <AddressManager
        isOpen={isAddressManagerOpen}
        onClose={() => setIsAddressManagerOpen(false)}
        onSelectAddress={handleSelectAddress}
        selectedAddressId={selectedAddress?.id}
        showToast={showToast}
      />
    </div>
  );
};

export default CartModal;

