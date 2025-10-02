import { deliveryZones, deliveryConfig } from '../data/deliveryZones';

/**
 * Serviço de cálculo de frete e entrega
 */
class DeliveryService {
  /**
   * Calcula o frete baseado no CEP
   * @param {string} cep - CEP do destino
   * @param {number} cartTotal - Valor total do carrinho
   * @returns {Object} Informações de entrega
   */
  static calculateDeliveryFee(cep, cartTotal = 0) {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        return {
          success: false,
          error: 'CEP inválido',
          fee: 0,
          freeDelivery: false,
          estimatedTime: null,
          zone: null
        };
      }

      // Encontrar zona de entrega
      const zone = this.findDeliveryZone(cleanCep);
      
      if (!zone) {
        return {
          success: false,
          error: 'Área não atendida',
          fee: 0,
          freeDelivery: false,
          estimatedTime: null,
          zone: null
        };
      }

      // Verificar se qualifica para frete grátis
      const qualifiesForFreeDelivery = this.checkFreeDelivery(cartTotal, zone);
      
      const deliveryFee = qualifiesForFreeDelivery ? 0 : zone.deliveryFee;

      return {
        success: true,
        error: null,
        fee: deliveryFee,
        freeDelivery: qualifiesForFreeDelivery,
        estimatedTime: zone.estimatedTime,
        zone: zone.name,
        zoneData: zone
      };
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      return {
        success: false,
        error: 'Erro interno no cálculo do frete',
        fee: 0,
        freeDelivery: false,
        estimatedTime: null,
        zone: null
      };
    }
  }

  /**
   * Encontra a zona de entrega baseada no CEP
   * @param {string} cleanCep - CEP limpo (apenas números)
   * @returns {Object|null} Zona de entrega ou null se não encontrada
   */
  static findDeliveryZone(cleanCep) {
    for (const zone of deliveryZones) {
      for (const cepRange of zone.cepRanges) {
        if (this.cepInRange(cleanCep, cepRange)) {
          return zone;
        }
      }
    }
    return null;
  }

  /**
   * Verifica se um CEP está dentro de um range
   * @param {string} cep - CEP a verificar
   * @param {string} range - Range no formato "01000-01999" ou "01000"
   * @returns {boolean} Se o CEP está no range
   */
  static cepInRange(cep, range) {
    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const cepNum = parseInt(cep);
      const startNum = parseInt(start.padEnd(8, '0'));
      const endNum = parseInt(end.padEnd(8, '9'));
      return cepNum >= startNum && cepNum <= endNum;
    } else {
      // Range específico ou prefixo
      return cep.startsWith(range);
    }
  }

  /**
   * Verifica se qualifica para frete grátis
   * @param {number} cartTotal - Valor total do carrinho
   * @param {Object} zone - Zona de entrega
   * @returns {boolean} Se qualifica para frete grátis
   */
  static checkFreeDelivery(cartTotal, zone) {
    // Frete grátis global
    if (cartTotal >= deliveryConfig.freeDeliveryThreshold) {
      return true;
    }

    // Frete grátis específico da zona
    if (zone.freeDeliveryThreshold && cartTotal >= zone.freeDeliveryThreshold) {
      return true;
    }

    // Zona com frete sempre grátis
    if (zone.deliveryFee === 0) {
      return true;
    }

    return false;
  }

  /**
   * Valida se um CEP está em área de entrega
   * @param {string} cep - CEP a validar
   * @returns {Object} Resultado da validação
   */
  static validateDeliveryArea(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return {
        valid: false,
        error: 'CEP deve ter 8 dígitos'
      };
    }

    const zone = this.findDeliveryZone(cleanCep);
    
    if (!zone) {
      return {
        valid: false,
        error: 'Não entregamos nesta região'
      };
    }

    return {
      valid: true,
      zone: zone.name,
      estimatedTime: zone.estimatedTime
    };
  }

  /**
   * Obtém informações de todas as zonas de entrega
   * @returns {Array} Lista de zonas com informações resumidas
   */
  static getDeliveryZones() {
    return deliveryZones.map(zone => ({
      name: zone.name,
      deliveryFee: zone.deliveryFee,
      estimatedTime: zone.estimatedTime,
      freeDeliveryThreshold: zone.freeDeliveryThreshold
    }));
  }

  /**
   * Calcula tempo estimado de entrega
   * @param {string} cep - CEP de destino
   * @returns {string|null} Tempo estimado ou null se não encontrado
   */
  static getEstimatedDeliveryTime(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    const zone = this.findDeliveryZone(cleanCep);
    return zone ? zone.estimatedTime : null;
  }

  /**
   * Formata valor de frete para exibição
   * @param {number} fee - Valor do frete
   * @param {boolean} isFree - Se é frete grátis
   * @returns {string} Frete formatado
   */
  static formatDeliveryFee(fee, isFree = false) {
    if (isFree || fee === 0) {
      return 'Grátis';
    }
    return `R$ ${fee.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Busca CEP em API externa (ViaCEP)
   * @param {string} cep - CEP a buscar
   * @returns {Promise<Object>} Dados do endereço
   */
  static async lookupCep(cep) {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        throw new Error('CEP inválido');
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        success: true,
        data: {
          cep: data.cep,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          complement: data.complemento
        }
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calcula frete com desconto promocional
   * @param {string} cep - CEP de destino
   * @param {number} cartTotal - Valor do carrinho
   * @param {string} promoCode - Código promocional
   * @returns {Object} Informações de entrega com desconto
   */
  static calculateDeliveryWithPromo(cep, cartTotal, promoCode = null) {
    const baseDelivery = this.calculateDeliveryFee(cep, cartTotal);
    
    if (!baseDelivery.success || baseDelivery.freeDelivery) {
      return baseDelivery;
    }

    // Aplicar desconto promocional no frete
    let discountedFee = baseDelivery.fee;
    let promoApplied = false;

    if (promoCode) {
      // Códigos promocionais de frete
      const promoDiscounts = {
        'FRETEGRATIS': 1.0, // 100% desconto
        'FRETE50': 0.5,     // 50% desconto
        'FRETE20': 0.2      // 20% desconto
      };

      const discount = promoDiscounts[promoCode.toUpperCase()];
      if (discount) {
        discountedFee = baseDelivery.fee * (1 - discount);
        promoApplied = true;
      }
    }

    return {
      ...baseDelivery,
      fee: discountedFee,
      originalFee: baseDelivery.fee,
      promoApplied,
      promoCode: promoApplied ? promoCode : null,
      freeDelivery: discountedFee === 0
    };
  }
}

export default DeliveryService;