const coupons = [
  {
    code: "BEMVINDO10",
    description: "10% de desconto para novos clientes",
    discount: 0.10,
    type: "percentage",
    minValue: 15.00,
    maxDiscount: 10.00,
    isActive: true,
    expiryDate: "2024-12-31",
    usageLimit: 1,
    category: "welcome"
  },
  {
    code: "FRETE5",
    description: "R$ 5,00 de desconto",
    discount: 5.00,
    type: "fixed",
    minValue: 25.00,
    maxDiscount: 5.00,
    isActive: true,
    expiryDate: "2024-12-31",
    usageLimit: null,
    category: "delivery"
  },
  {
    code: "COMBO15",
    description: "15% de desconto em combos",
    discount: 0.15,
    type: "percentage",
    minValue: 30.00,
    maxDiscount: 15.00,
    isActive: true,
    expiryDate: "2024-12-31",
    usageLimit: null,
    category: "combo"
  },
  {
    code: "SANDUBAO20",
    description: "20% de desconto acima de R$ 50",
    discount: 0.20,
    type: "percentage",
    minValue: 50.00,
    maxDiscount: 20.00,
    isActive: true,
    expiryDate: "2024-12-31",
    usageLimit: null,
    category: "general"
  },
  {
    code: "PRIMEIRACOMPRA",
    description: "R$ 10,00 de desconto na primeira compra",
    discount: 10.00,
    type: "fixed",
    minValue: 20.00,
    maxDiscount: 10.00,
    isActive: true,
    expiryDate: "2024-12-31",
    usageLimit: 1,
    category: "welcome"
  }
];

export default coupons;