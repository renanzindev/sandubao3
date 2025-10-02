// Sistema de armazenamento local para endereços favoritos
const STORAGE_KEY = 'sandubao_addresses';

// Estrutura de um endereço
const createAddress = (data) => ({
  id: data.id || Date.now().toString(),
  name: data.name || '', // Nome do endereço (ex: "Casa", "Trabalho")
  street: data.street || '',
  number: data.number || '',
  complement: data.complement || '',
  neighborhood: data.neighborhood || '',
  city: data.city || '',
  state: data.state || '',
  cep: data.cep || '',
  reference: data.reference || '',
  isDefault: data.isDefault || false,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Função para obter todos os endereços salvos
export const getSavedAddresses = () => {
  try {
    const addresses = localStorage.getItem(STORAGE_KEY);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error('Erro ao carregar endereços:', error);
    return [];
  }
};

// Função para salvar um novo endereço
export const saveAddress = (addressData) => {
  try {
    const addresses = getSavedAddresses();
    const newAddress = createAddress(addressData);
    
    // Se este endereço for marcado como padrão, remove o padrão dos outros
    if (newAddress.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }
    
    // Se for o primeiro endereço, marca como padrão automaticamente
    if (addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    addresses.push(newAddress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return {
      success: true,
      address: newAddress,
      message: 'Endereço salvo com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao salvar endereço:', error);
    return {
      success: false,
      error: 'Erro ao salvar endereço',
      message: 'Não foi possível salvar o endereço'
    };
  }
};

// Função para atualizar um endereço existente
export const updateAddress = (addressId, addressData) => {
  try {
    const addresses = getSavedAddresses();
    const addressIndex = addresses.findIndex(addr => addr.id === addressId);
    
    if (addressIndex === -1) {
      return {
        success: false,
        error: 'Endereço não encontrado',
        message: 'Endereço não encontrado'
      };
    }
    
    // Atualiza o endereço mantendo o ID e data de criação
    const updatedAddress = createAddress({
      ...addressData,
      id: addressId,
      createdAt: addresses[addressIndex].createdAt
    });
    
    // Se este endereço for marcado como padrão, remove o padrão dos outros
    if (updatedAddress.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }
    
    addresses[addressIndex] = updatedAddress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return {
      success: true,
      address: updatedAddress,
      message: 'Endereço atualizado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    return {
      success: false,
      error: 'Erro ao atualizar endereço',
      message: 'Não foi possível atualizar o endereço'
    };
  }
};

// Função para deletar um endereço
export const deleteAddress = (addressId) => {
  try {
    const addresses = getSavedAddresses();
    const addressIndex = addresses.findIndex(addr => addr.id === addressId);
    
    if (addressIndex === -1) {
      return {
        success: false,
        error: 'Endereço não encontrado',
        message: 'Endereço não encontrado'
      };
    }
    
    const deletedAddress = addresses[addressIndex];
    addresses.splice(addressIndex, 1);
    
    // Se o endereço deletado era o padrão e ainda há outros endereços,
    // marca o primeiro como padrão
    if (deletedAddress.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return {
      success: true,
      message: 'Endereço removido com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    return {
      success: false,
      error: 'Erro ao deletar endereço',
      message: 'Não foi possível remover o endereço'
    };
  }
};

// Função para obter o endereço padrão
export const getDefaultAddress = () => {
  const addresses = getSavedAddresses();
  return addresses.find(addr => addr.isDefault) || null;
};

// Função para definir um endereço como padrão
export const setDefaultAddress = (addressId) => {
  try {
    const addresses = getSavedAddresses();
    
    // Remove o padrão de todos os endereços
    addresses.forEach(addr => addr.isDefault = false);
    
    // Define o novo endereço padrão
    const targetAddress = addresses.find(addr => addr.id === addressId);
    if (targetAddress) {
      targetAddress.isDefault = true;
      targetAddress.updatedAt = new Date().toISOString();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return {
      success: true,
      message: 'Endereço padrão definido com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao definir endereço padrão:', error);
    return {
      success: false,
      error: 'Erro ao definir endereço padrão',
      message: 'Não foi possível definir o endereço padrão'
    };
  }
};

// Função para formatar endereço para exibição
export const formatAddressForDisplay = (address) => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    address.city,
    address.state
  ].filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
};

// Função para formatar endereço completo
export const formatFullAddress = (address) => {
  if (!address) return '';
  
  let formatted = '';
  
  if (address.street) {
    formatted += address.street;
    if (address.number) {
      formatted += `, ${address.number}`;
    }
    if (address.complement) {
      formatted += `, ${address.complement}`;
    }
  }
  
  if (address.neighborhood) {
    formatted += formatted ? ` - ${address.neighborhood}` : address.neighborhood;
  }
  
  if (address.city) {
    formatted += formatted ? `, ${address.city}` : address.city;
  }
  
  if (address.state) {
    formatted += ` - ${address.state}`;
  }
  
  if (address.cep) {
    formatted += ` - CEP: ${address.cep}`;
  }
  
  return formatted;
};

// Função para formatar CEP no padrão brasileiro (XXXXX-XXX)
export const formatCep = (cep) => {
  if (!cep) return '';
  
  // Remove tudo que não for número
  const numbers = cep.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  const limitedNumbers = numbers.slice(0, 8);
  
  // Aplica a formatação XXXXX-XXX
  if (limitedNumbers.length <= 5) {
    return limitedNumbers;
  } else {
    return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
  }
};

// Função para validar dados do endereço
export const validateAddress = (address) => {
  const errors = {};
  
  if (!address.name || address.name.trim() === '') {
    errors.name = 'Nome do endereço é obrigatório';
  }
  
  if (!address.street || address.street.trim() === '') {
    errors.street = 'Rua é obrigatória';
  }
  
  if (!address.number || address.number.trim() === '') {
    errors.number = 'Número é obrigatório';
  }
  
  if (!address.neighborhood || address.neighborhood.trim() === '') {
    errors.neighborhood = 'Bairro é obrigatório';
  }
  
  if (!address.city || address.city.trim() === '') {
    errors.city = 'Cidade é obrigatória';
  }
  
  if (!address.state || address.state.trim() === '') {
    errors.state = 'Estado é obrigatório';
  }
  
  if (!address.cep || address.cep.trim() === '') {
    errors.cep = 'CEP é obrigatório';
  } else {
    const cleanCep = address.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      errors.cep = 'CEP deve ter 8 dígitos';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  getSavedAddresses,
  saveAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  setDefaultAddress,
  formatAddressForDisplay,
  formatFullAddress,
  formatCep,
  validateAddress
};