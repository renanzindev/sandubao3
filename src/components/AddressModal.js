import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faMapMarkerAlt, 
  faHome,
  faBriefcase,
  faHeart,
  faSearch,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { validateAddress, formatCep } from '../utils/addressStorage';
import { calculateDeliveryFee } from '../data/deliveryZones';

const AddressModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAddress = null,
  showToast 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    reference: '',
    isDefault: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // Predefined address names
  const addressTypes = [
    { icon: faHome, name: 'Casa', color: 'text-blue-500' },
    { icon: faBriefcase, name: 'Trabalho', color: 'text-green-500' },
    { icon: faHeart, name: 'Favorito', color: 'text-red-500' }
  ];

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
      if (editingAddress.cep) {
        handleCepLookup(editingAddress.cep);
      }
    } else {
      setFormData({
        name: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: '',
        reference: '',
        isDefault: false
      });
    }
    setErrors({});
    setDeliveryInfo(null);
  }, [editingAddress, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Format CEP and trigger lookup
    if (field === 'cep') {
      const formatted = formatCep(value);
      setFormData(prev => ({
        ...prev,
        cep: formatted
      }));

      if (formatted.length === 9) {
        handleCepLookup(formatted);
      }
    }
  };

  const handleCepLookup = async (cep) => {
    setCepLoading(true);
    
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length === 8) {
        // Calculate delivery fee
        const deliveryResult = calculateDeliveryFee(cleanCep);
        setDeliveryInfo(deliveryResult);

        // Real ViaCEP API call
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          showToast && showToast('CEP não encontrado', 'error');
          setCepLoading(false);
          return;
        }

        // Update form with API data
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
        
        setCepLoading(false);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      showToast && showToast('Erro ao buscar CEP. Tente novamente.', 'error');
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = validateAddress(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      await onSave(formData);
      onClose();
      showToast && showToast(
        editingAddress ? 'Endereço atualizado com sucesso!' : 'Endereço salvo com sucesso!',
        'success'
      );
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      showToast && showToast('Erro ao salvar endereço', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Address Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Nome do Endereço
            </label>
            <div className="flex gap-2 mb-2">
              {addressTypes.map((type) => (
                <button
                  key={type.name}
                  type="button"
                  onClick={() => handleInputChange('name', type.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    formData.name === type.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={type.icon} className={type.color} />
                  <span className="text-sm">{type.name}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ex: Casa, Trabalho, Casa da Vó..."
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* CEP */}
          <div>
            <label className="block text-sm font-medium mb-2">CEP</label>
            <div className="relative">
              <input
                type="text"
                placeholder="00000-000"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.cep ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={9}
              />
              {cepLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {errors.cep && (
              <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
            )}
            
            {/* Delivery Info */}
            {deliveryInfo && (
              <div className={`mt-2 p-2 rounded text-sm ${
                deliveryInfo.freeDelivery 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span>
                    {deliveryInfo.freeDelivery ? '🎉 Frete Grátis!' : `📦 Frete: R$ ${deliveryInfo.fee.toFixed(2)}`}
                  </span>
                  <span className="text-xs">⏱️ {deliveryInfo.estimatedTime}</span>
                </div>
                {deliveryInfo.zone && (
                  <p className="text-xs mt-1">Zona: {deliveryInfo.zone}</p>
                )}
              </div>
            )}
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium mb-2">Rua/Avenida</label>
            <input
              type="text"
              placeholder="Nome da rua"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          {/* Number and Complement */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Número</label>
              <input
                type="text"
                placeholder="123"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Complemento</label>
              <input
                type="text"
                placeholder="Apto 101"
                value={formData.complement}
                onChange={(e) => handleInputChange('complement', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
              />
            </div>
          </div>

          {/* Neighborhood */}
          <div>
            <label className="block text-sm font-medium mb-2">Bairro</label>
            <input
              type="text"
              placeholder="Nome do bairro"
              value={formData.neighborhood}
              onChange={(e) => handleInputChange('neighborhood', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.neighborhood ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.neighborhood && (
              <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>
            )}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <input
                type="text"
                placeholder="SP"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={2}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium mb-2">Ponto de Referência</label>
            <input
              type="text"
              placeholder="Ex: Próximo ao mercado, em frente à escola..."
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            />
          </div>

          {/* Default Address */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isDefault" className="text-sm">
              Definir como endereço padrão
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                editingAddress ? 'Atualizar' : 'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;