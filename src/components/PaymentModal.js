import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faCreditCard, 
  faMoneyBillWave, 
  faQrcode,
  faTag,
  faCalculator,
  faCopy,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faPix } from "@fortawesome/free-brands-svg-icons";
import QRCode from 'qrcode';
import coupons from "../data/coupons";

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  total, 
  cart, 
  checkoutData, 
  onPaymentComplete 
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [change, setChange] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [finalTotal, setFinalTotal] = useState(total);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Gerar dados PIX
  const generatePixQRCode = async () => {
    // Simulação de dados PIX - em produção, isso viria de uma API de pagamento
    const pixData = {
      key: "31971659344", // Chave PIX (telefone)
      amount: finalTotal,
      description: `Pedido SanduBão - ${checkoutData?.customerName || 'Cliente'}`,
      merchantName: "SanduBão",
      merchantCity: "Belo Horizonte",
      txid: `SANDUBAO${Date.now()}`,
    };

    // Gerar string PIX (formato simplificado para demonstração)
    const pixString = `00020126580014BR.GOV.BCB.PIX0136${pixData.key}0208${pixData.description}5204000053039865802BR5913${pixData.merchantName}6015${pixData.merchantCity}62070503***6304`;
    
    try {
      // Gerar QR Code real usando a biblioteca qrcode
      const qrCodeDataURL = await QRCode.toDataURL(pixString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return {
        qrCodeData: qrCodeDataURL,
        pixCopyPaste: pixString,
        ...pixData
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return {
        qrCodeData: null,
        pixCopyPaste: pixString,
        ...pixData
      };
    }
  };

  // Calcular total com frete
  useEffect(() => {
    let totalWithDelivery = total;
    
    if (checkoutData?.deliveryInfo && !checkoutData.deliveryInfo.isFreeDelivery) {
      totalWithDelivery += checkoutData.deliveryInfo.fee;
    }
    
    // Se não há cupom aplicado, atualizar o total final
    if (!appliedCoupon) {
      setFinalTotal(totalWithDelivery);
    } else {
      // Recalcular desconto com o novo total
      let discount = 0;
      if (appliedCoupon.type === "percentage") {
        discount = totalWithDelivery * appliedCoupon.discount;
        if (discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
      } else {
        discount = appliedCoupon.discount;
      }
      setFinalTotal(totalWithDelivery - discount);
    }
  }, [total, checkoutData, appliedCoupon]);

  // Calcular troco
  useEffect(() => {
    if (cashAmount && paymentMethod === "Dinheiro") {
      const changeAmount = parseFloat(cashAmount) - finalTotal;
      setChange(changeAmount > 0 ? changeAmount : 0);
    }
  }, [cashAmount, finalTotal, paymentMethod]);

  // Aplicar cupom
  const applyCoupon = () => {
    setCouponError("");
    
    if (!couponCode.trim()) {
      setCouponError("Digite um código de cupom");
      return;
    }

    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
    );

    if (!coupon) {
      setCouponError("Cupom inválido ou expirado");
      return;
    }

    // Calcular total com frete para validação do cupom
    let totalWithDelivery = total;
    if (checkoutData?.deliveryInfo && !checkoutData.deliveryInfo.isFreeDelivery) {
      totalWithDelivery += checkoutData.deliveryInfo.fee;
    }

    if (totalWithDelivery < coupon.minValue) {
      setCouponError(`Valor mínimo de R$ ${coupon.minValue.toFixed(2)} para este cupom`);
      return;
    }

    // Verificar data de expiração
    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (today > expiryDate) {
      setCouponError("Cupom expirado");
      return;
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = totalWithDelivery * coupon.discount;
      if (discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discount;
    }

    setAppliedCoupon({ ...coupon, discountAmount: discount });
    setFinalTotal(totalWithDelivery - discount);
  };

  // Remover cupom
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    
    // Calcular total com frete
    let totalWithDelivery = total;
    if (checkoutData?.deliveryInfo && !checkoutData.deliveryInfo.isFreeDelivery) {
      totalWithDelivery += checkoutData.deliveryInfo.fee;
    }
    
    setFinalTotal(totalWithDelivery);
  };

  // Copiar código PIX
  const copyPixCode = () => {
    if (pixData && pixData.pixCopyPaste) {
      navigator.clipboard.writeText(pixData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Finalizar pagamento
  const handlePaymentComplete = () => {
    const paymentData = {
      method: paymentMethod,
      total: finalTotal,
      originalTotal: total,
      coupon: appliedCoupon,
      cashAmount: paymentMethod === "Dinheiro" ? parseFloat(cashAmount) : null,
      change: paymentMethod === "Dinheiro" ? change : null,
      pixData: paymentMethod === "PIX" ? pixData : null
    };

    onPaymentComplete(paymentData);
  };

  // Gerar dados PIX quando o método PIX for selecionado
  useEffect(() => {
    if (paymentMethod === "PIX") {
      setIsGeneratingQR(true);
      generatePixQRCode().then(data => {
        setPixData(data);
        setIsGeneratingQR(false);
      });
    }
  }, [paymentMethod, finalTotal, checkoutData?.customerName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Pagamento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Resumo do Pedido */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal dos itens:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              
              {/* Informações de entrega */}
              {checkoutData?.deliveryInfo && (
                <div className="flex justify-between">
                  <span>Taxa de entrega:</span>
                  <span className={checkoutData.deliveryInfo.isFreeDelivery ? "text-green-600 font-medium" : ""}>
                    {checkoutData.deliveryInfo.isFreeDelivery ? "GRÁTIS" : `R$ ${checkoutData.deliveryInfo.fee.toFixed(2)}`}
                  </span>
                </div>
              )}
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span>-R$ {appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-1">
                <span>Total:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
              </div>
              
              {/* Informações adicionais de entrega */}
              {checkoutData?.deliveryInfo && (
                <div className="text-xs text-gray-600 mt-2 pt-2 border-t">
                  <p>📍 Zona: {checkoutData.deliveryInfo.zone}</p>
                  <p>⏱️ Tempo estimado: {checkoutData.deliveryInfo.estimatedTime}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cupom de Desconto */}
          <div className="border rounded-lg p-3">
            <h3 className="font-semibold mb-2 flex items-center">
              <FontAwesomeIcon icon={faTag} className="mr-2 text-orange-500" />
              Cupom de Desconto
            </h3>
            
            {!appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o código do cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs">{couponError}</p>
                )}
                <div className="text-xs text-gray-500">
                  <p>Cupons disponíveis: BEMVINDO10, FRETE5, COMBO15</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-2 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-700">{appliedCoupon.code}</p>
                  <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                  <p className="text-sm text-green-700">
                    Economia: R$ {appliedCoupon.discountAmount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
          </div>

          {/* Métodos de Pagamento */}
          <div className="space-y-3">
            <h3 className="font-semibold">Método de Pagamento</h3>
            
            {/* PIX */}
            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === "PIX" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMethod("PIX")}
            >
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faQrcode} className="text-green-600 text-xl" />
                <div>
                  <p className="font-medium">PIX</p>
                  <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                </div>
              </div>
              
              {paymentMethod === "PIX" && (
                <div className="mt-3 pt-3 border-t">
                  <div className="bg-white p-3 rounded border text-center">
                    {isGeneratingQR ? (
                      <div className="py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Gerando QR Code...</p>
                      </div>
                    ) : pixData ? (
                      <>
                        <div className="mb-3">
                          {pixData.qrCodeData ? (
                            <img 
                              src={pixData.qrCodeData} 
                              alt="QR Code PIX" 
                              className="mx-auto border rounded"
                            />
                          ) : (
                            <div className="text-6xl mb-2">📱</div>
                          )}
                        </div>
                        <p className="text-sm mb-2">Escaneie o QR Code ou copie o código PIX</p>
                        <div className="bg-gray-100 p-2 rounded text-xs break-all mb-2 max-h-20 overflow-y-auto">
                          {pixData.pixCopyPaste}
                        </div>
                        <button
                          onClick={copyPixCode}
                          className="flex items-center justify-center space-x-2 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 mx-auto"
                        >
                          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                          <span>{copied ? "Copiado!" : "Copiar Código"}</span>
                        </button>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Valor: R$ {pixData.amount.toFixed(2)}</p>
                          <p>Chave: {pixData.key}</p>
                        </div>
                      </>
                    ) : (
                      <div className="py-4">
                        <p className="text-sm text-red-600">Erro ao gerar QR Code</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dinheiro */}
            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === "Dinheiro" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMethod("Dinheiro")}
            >
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-600 text-xl" />
                <div>
                  <p className="font-medium">Dinheiro</p>
                  <p className="text-sm text-gray-600">Pagamento na entrega</p>
                </div>
              </div>
              
              {paymentMethod === "Dinheiro" && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                        Valor pago pelo cliente:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={finalTotal}
                        placeholder={`Mínimo: R$ ${finalTotal.toFixed(2)}`}
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    {cashAmount && parseFloat(cashAmount) >= finalTotal && (
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Troco:</span>
                          <span className="text-lg font-bold text-blue-600">
                            R$ {change.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cartão */}
            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === "Cartão" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMethod("Cartão")}
            >
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCreditCard} className="text-blue-600 text-xl" />
                <div>
                  <p className="font-medium">Cartão</p>
                  <p className="text-sm text-gray-600">Débito ou crédito na entrega</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Finalizar */}
          <button
            onClick={handlePaymentComplete}
            disabled={!paymentMethod || (paymentMethod === "Dinheiro" && (!cashAmount || parseFloat(cashAmount) < finalTotal))}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;