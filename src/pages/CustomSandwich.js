import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faMinus, 
  faShoppingCart, 
  faSave,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { ingredients, categories } from "../data/ingredients";
import ProductModal from "../components/ProductModal";

const CustomSandwich = ({ addToCart, showToast }) => {
  const [customSandwich, setCustomSandwich] = useState({
    name: "",
    description: "",
    price: 0,
    ingredients: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (!customSandwich.name.trim()) {
      showToast && showToast("Digite um nome para o sanduíche primeiro!", "error");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addIngredient = (ingredient) => {
    setCustomSandwich(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
      price: prev.price + ingredient.price
    }));
  };

  const removeIngredient = (index) => {
    const ingredient = customSandwich.ingredients[index];
    setCustomSandwich(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
      price: prev.price - ingredient.price
    }));
  };

  const handleSave = async () => {
    if (!customSandwich.name.trim()) {
      showToast && showToast("Por favor, digite o nome do sanduíche!", "error");
      return;
    }

    if (customSandwich.ingredients.length === 0) {
      showToast && showToast("Adicione pelo menos um ingrediente!", "error");
      return;
    }

    setIsLoading(true);

    // Simula salvamento
    setTimeout(() => {
      const defaultImage = "/api/placeholder/300/200";
      
      addToCart && addToCart(
        customSandwich.name,
        customSandwich.price,
        defaultImage
      );

      showToast && showToast(`${customSandwich.name} adicionado ao carrinho!`, "success");
      
      // Reset form
      setCustomSandwich({
        name: "",
        description: "",
        price: 0,
        ingredients: []
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const clearForm = () => {
    setCustomSandwich({
      name: "",
      description: "",
      price: 0,
      ingredients: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍔 Monte seu Sanduíche
          </h1>
          <p className="text-gray-600 text-lg">
            Crie o sanduíche dos seus sonhos com os ingredientes que você escolher!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Configuração */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faSave} className="mr-3 text-yellow-500" />
              Configurações
            </h2>

            {/* Nome do Sanduíche */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Nome do Sanduíche *
              </label>
              <input
                type="text"
                value={customSandwich.name}
                onChange={(e) => setCustomSandwich(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Mega Burger Especial"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                maxLength={50}
              />
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Descrição
              </label>
              <textarea
                value={customSandwich.description}
                onChange={(e) => setCustomSandwich(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva seu sanduíche personalizado..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none"
                maxLength={200}
              />
            </div>



            {/* Preço Total */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Preço Total:</span>
                <span className="text-2xl font-bold text-yellow-600">
                  R$ {customSandwich.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isLoading || !customSandwich.name.trim() || customSandwich.ingredients.length === 0}
                className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
              
              <button
                onClick={clearForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Visualização do Sanduíche */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faEye} className="mr-3 text-blue-500" />
              Visualização
            </h2>

            <div className="relative group">
              {/* Imagem do Sanduíche */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                <img
                  src="/api/placeholder/300/200"
                  alt={customSandwich.name || "Seu Sanduíche Personalizado"}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                
                {/* Overlay com ícone de olho */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl">
                  <button
                    onClick={openModal}
                    className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 transform hover:scale-110 shadow-lg"
                    aria-label="Ver detalhes do sanduíche"
                  >
                    <FontAwesomeIcon icon={faEye} className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Informações do Sanduíche */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {customSandwich.name || "Seu Sanduíche Personalizado"}
                </h3>
                
                <p className="text-sm text-gray-600">
                  {customSandwich.description || "Adicione uma descrição para seu sanduíche..."}
                </p>

                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-500 uppercase tracking-wide">Preço</span>
                  <p className="text-xl font-bold text-green-600">
                    R$ {customSandwich.price.toFixed(2)}
                  </p>
                </div>

                {customSandwich.ingredients.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-500 uppercase tracking-wide">Ingredientes</span>
                    <p className="text-sm text-gray-700 mt-1">
                      {customSandwich.ingredients.map(ing => ing.name).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Ingredientes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-3 text-green-500" />
              Ingredientes Disponíveis
            </h2>

            {/* Ingredientes por Categoria */}
            <div className="space-y-6 mb-6">
              {categories.map((category) => {
                const categoryIngredients = ingredients.filter(ing => ing.category === category.id);
                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-xl mr-2">{category.icon}</span>
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {categoryIngredients.map((ingredient) => (
                        <div
                          key={ingredient.id}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{ingredient.name}</span>
                              <span className="text-green-600 font-semibold">
                                +R$ {ingredient.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{ingredient.description}</p>
                          </div>
                          <button
                            onClick={() => addIngredient(ingredient)}
                            className="bg-green-500 text-white w-8 h-8 rounded-full hover:bg-green-600 transition-colors duration-200 flex items-center justify-center ml-3"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ingredientes Selecionados */}
            {customSandwich.ingredients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2 text-yellow-500" />
                  Ingredientes Selecionados ({customSandwich.ingredients.length})
                </h3>
                <div className="space-y-2">
                  {customSandwich.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{ingredient.name}</span>
                        <span className="text-yellow-600 font-semibold ml-2">
                          R$ {ingredient.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Visualização */}
      <ProductModal
        product={{
          name: customSandwich.name || "Seu Sanduíche Personalizado",
          description: customSandwich.description || `Sanduíche personalizado com ${customSandwich.ingredients.length} ingredientes: ${customSandwich.ingredients.map(ing => ing.name).join(", ")}`,
          price: customSandwich.price,
          image: "/api/placeholder/400/300"
        }}
        isOpen={isModalOpen}
        onClose={closeModal}
        addToCart={addToCart}
      />
    </div>
  );
};

export default CustomSandwich;