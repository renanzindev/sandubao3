// Configuração de zonas de entrega e preços de frete
const deliveryZones = [
  {
    id: 1,
    name: "Centro",
    description: "Centro da cidade",
    cepRanges: [
      { start: "01000000", end: "01999999" },
      { start: "08000000", end: "08999999" }
    ],
    deliveryFee: 5.00,
    estimatedTime: "30-45 min",
    active: true
  },
  {
    id: 2,
    name: "Zona Norte",
    description: "Bairros da Zona Norte",
    cepRanges: [
      { start: "02000000", end: "02999999" },
      { start: "03000000", end: "03999999" }
    ],
    deliveryFee: 7.50,
    estimatedTime: "45-60 min",
    active: true
  },
  {
    id: 3,
    name: "Zona Sul",
    description: "Bairros da Zona Sul",
    cepRanges: [
      { start: "04000000", end: "04999999" },
      { start: "05000000", end: "05999999" }
    ],
    deliveryFee: 8.00,
    estimatedTime: "40-55 min",
    active: true
  },
  {
    id: 4,
    name: "Zona Leste",
    description: "Bairros da Zona Leste",
    cepRanges: [
      { start: "06000000", end: "06999999" },
      { start: "07000000", end: "07999999" }
    ],
    deliveryFee: 9.00,
    estimatedTime: "50-65 min",
    active: true
  },
  {
    id: 5,
    name: "Zona Oeste",
    description: "Bairros da Zona Oeste",
    cepRanges: [
      { start: "09000000", end: "09999999" },
      { start: "10000000", end: "10999999" }
    ],
    deliveryFee: 10.00,
    estimatedTime: "55-70 min",
    active: true
  }
];

// Configurações gerais de entrega
const deliveryConfig = {
  freeDeliveryMinValue: 50.00, // Valor mínimo para frete grátis
  maxDeliveryDistance: 15, // Distância máxima em km
  defaultDeliveryFee: 12.00, // Taxa padrão para áreas não mapeadas
  defaultEstimatedTime: "60-90 min"
};

// Função para calcular frete baseado no CEP
export const calculateDeliveryFee = (cep, orderValue = 0) => {
  // Remove formatação do CEP
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    return {
      success: false,
      error: "CEP inválido",
      fee: 0,
      estimatedTime: "",
      zone: null
    };
  }

  // Verifica se o pedido tem frete grátis
  if (orderValue >= deliveryConfig.freeDeliveryMinValue) {
    return {
      success: true,
      fee: 0,
      estimatedTime: "30-45 min",
      zone: "Frete Grátis",
      freeDelivery: true
    };
  }

  // Procura a zona correspondente ao CEP
  for (const zone of deliveryZones) {
    if (!zone.active) continue;
    
    for (const range of zone.cepRanges) {
      const cepNum = parseInt(cleanCep);
      const startNum = parseInt(range.start);
      const endNum = parseInt(range.end);
      
      if (cepNum >= startNum && cepNum <= endNum) {
        return {
          success: true,
          fee: zone.deliveryFee,
          estimatedTime: zone.estimatedTime,
          zone: zone.name,
          zoneDescription: zone.description,
          freeDelivery: false
        };
      }
    }
  }

  // CEP não encontrado nas zonas mapeadas
  return {
    success: true,
    fee: deliveryConfig.defaultDeliveryFee,
    estimatedTime: deliveryConfig.defaultEstimatedTime,
    zone: "Área Externa",
    zoneDescription: "Fora das zonas principais de entrega",
    freeDelivery: false
  };
};

// Função para validar se entregamos no CEP
export const validateDeliveryArea = (cep) => {
  const result = calculateDeliveryFee(cep);
  return {
    delivers: result.success,
    message: result.success ? 
      `Entregamos na sua região! Taxa: R$ ${result.fee.toFixed(2)}` : 
      result.error
  };
};

// Função para formatar CEP
export const formatCep = (cep) => {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export { deliveryZones, deliveryConfig };
export default deliveryZones;