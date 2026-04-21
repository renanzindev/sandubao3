import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPlus, 
  faEdit, 
  faTrash,
  faMapMarkerAlt,
  faHome,
  faBriefcase,
  faHeart,
  faStar,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import AddressModal from './AddressModal';
import { 
  getSavedAddresses, 
  saveAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  formatAddressForDisplay 
} from '../utils/addressStorage';

const AddressManager = ({ 
  isOpen, 
  onClose, 
  onSelectAddress, 
  selectedAddressId = null,
  showToast 
}) => {
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load addresses on component mount
  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen]);

  const loadAddresses = () => {
    const savedAddresses = getSavedAddresses();
    setAddresses(savedAddresses);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
        showToast && showToast('Endereço atualizado com sucesso!', 'successo');
      } else {
        await saveAddress(addressData);
        showToast && showToast('Endereço salvo com sucesso!', 'successo');
      }
      
      loadAddresses();
      setIsAddressModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      showToast && showToast('Erro ao salvar endereço', 'error');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      loadAddresses();
      setDeleteConfirm(null);
      showToast && showToast('Endereço removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
      showToast && showToast('Erro ao remover endereço', 'error');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      loadAddresses();
      showToast && showToast('Endereço padrão definido!', 'success');
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
      showToast && showToast('Erro ao definir endereço padrão', 'error');
    }
  };

  const handleSelectAddress = (address) => {
    onSelectAddress && onSelectAddress(address);
    onClose();
  };

  const getAddressIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('casa') || lowerName.includes('home')) {
      return { icon: faHome, color: 'text-blue-500' };
    }
    if (lowerName.includes('trabalho') || lowerName.includes('work')) {
      return { icon: faBriefcase, color: 'text-green-500' };
    }
    if (lowerName.includes('favorito') || lowerName.includes('favorite')) {
      return { icon: faHeart, color: 'text-red-500' };
    }
    return { icon: faMapMarkerAlt, color: 'text-gray-500' };
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Meus Endereços</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon 
                  icon={faMapMarkerAlt} 
                  className="text-4xl text-gray-300 mb-4" 
                />
                <p className="text-gray-500 mb-4">
                  Você ainda não tem endereços salvos
                </p>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Adicionar Primeiro Endereço
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => {
                  const iconData = getAddressIcon(address.name);
                  const isSelected = selectedAddressId === address.id;
                  
                  return (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon 
                              icon={iconData.icon} 
                              className={iconData.color} 
                            />
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                <FontAwesomeIcon icon={faStar} className="mr-1" />
                                Padrão
                              </span>
                            )}
                            {isSelected && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                Selecionado
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-1">
                            {formatAddressForDisplay(address)}
                          </p>
                          
                          {address.reference && (
                            <p className="text-gray-500 text-xs">
                              📍 {address.reference}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                              className="text-yellow-500 hover:text-yellow-600 p-1"
                              title="Definir como padrão"
                            >
                              <FontAwesomeIcon icon={faStar} />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="text-blue-500 hover:text-blue-600 p-1"
                            title="Editar"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(address.id);
                            }}
                            className="text-red-500 hover:text-red-600 p-1"
                            title="Excluir"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {addresses.length > 0 && (
            <div className="border-t p-4">
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Adicionar Novo Endereço
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="text-4xl text-red-500 mb-4" 
              />
              <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteAddress(deleteConfirm)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressManager;