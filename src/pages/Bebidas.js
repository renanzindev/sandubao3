import React from "react";
import cocacolaImg from "../assets/refri-coca.png";
import guaranaImg from "../assets/refri-guarana.png";



const Bebidas = () => {
  const bebidas = [
    {
      name: "Coca-Cola (Lata)",
      description: "Refrigerante de 350ml.",
      price: 6.0,
      image: cocacolaImg,
    },
    {
      name: "Guaraná (Lata)",
      description: "Refrigerante de 350ml.",
      price: 5.0,
      image: guaranaImg,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-6">Bebidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bebidas.map((bebida, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h3 className="font-bold text-xl">{bebida.name}</h3>
            <p>{bebida.description}</p>
            <p className="font-bold text-lg mt-2">R$ {bebida.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bebidas;
