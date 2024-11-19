import React from "react";

const Combos = () => {
  const combos = [
    { name: "Combo 1", price: 25.0, description: "1 X-Bacon + 1 Coca-Cola (Lata)." },
    { name: "Combo 2", price: 30.0, description: "1 X-Tudo Turbo + 1 Guaraná (Lata)." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-6">Combos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h3 className="font-bold text-xl">{combo.name}</h3>
            <p>{combo.description}</p>
            <p className="font-bold text-lg mt-2">R$ {combo.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Combos;
