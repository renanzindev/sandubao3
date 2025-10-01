import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faMinus, 
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";
import { ingredients, categories } from "../data/ingredients";

const CustomSandwich = ({ addToCart, showToast }) => {
  const [customSandwich, setCustomSandwich] = useState({
    name: "",
    description: "",
    price: 0,
    ingredients: []
  });

  const [isLoading, setIsLoading] = useState(false);

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
    if (customSandwich.ingredients.length === 0) {
      showToast && showToast("Adicione pelo menos um ingrediente!", "error");
      return;
    }

    setIsLoading(true);

    // Simula salvamento
    setTimeout(() => {
      const defaultImage = "/api/placeholder/300/200";
      const sandwichName = "Lanche Personalizado";
      
      addToCart && addToCart(
        sandwichName,
        customSandwich.price,
        defaultImage
      );

      showToast && showToast(`${sandwichName} adicionado ao carrinho!`, "success");
      
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3 text-yellow-500" />
              Seu Lanche Personalizado
            </h2>

            {/* Ingredientes Selecionados */}
            {customSandwich.ingredients.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ingredientes do seu lanche ({customSandwich.ingredients.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {customSandwich.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{ingredient.name}</span>
                        <span className="text-green-600 font-semibold ml-2">
                          +R$ {ingredient.price.toFixed(2)}
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
            ) : (
              <div className="mb-6 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500 text-lg">
                  🍔 Comece adicionando ingredientes para montar seu lanche!
                </p>
              </div>
            )}

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
                disabled={isLoading || customSandwich.ingredients.length === 0}
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


    </div>
  );
};

export default CustomSandwich;