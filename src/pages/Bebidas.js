import React from "react";
import cocacolaImg from "../assets/refri-coca.png";
import guaranaImg from "../assets/refri-guarana.png";
import fantaImg from "../assets/FantaLaranja.png";
import CocaCola2L from "../assets/cocaCola2Litros.png"
import Soda2L from "../assets/Soda2L.png"
import GuaranaAntartica from "../assets/GuaranaAntartica.png"
import AguaGas from "../assets/AguaGas.png"
import CocaZero from "../assets/CocaCola2LZero.png"



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
    {
      name: "Fanta Laranja (Lata)",
      description: "Refrigerante de 350ml.",
      price: 5.0,
      image: fantaImg,
    },
    {
      name: "Coca-Cola (2L)",
      description: "Refrigerante de 2L.",
      price: 13.0,
      image: CocaCola2L,
    },
    {
      name: "Soda (2L)",
      description: "Refrigerante de 2L.",
      price: 10.0,
      image: Soda2L,
    },
    {
      name: "Guarana Antartica (2L)",
      description: "Refrigerante de 2L.",
      price: 12.0,
      image: GuaranaAntartica,
    },
    {
      name: "Agua com Gás (500ml)",
      description: "Água mineral com gás de 500ml.",
      price: 4.0,
      image: AguaGas,
    },
    {
      name: "Coca-Cola Zero (2L)",
      description: "Refrigerante de 2L.",
      price: 13.0,
      image: CocaZero,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2">
      <h2 className="text-3xl font-bold my-4">Bebidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bebidas.map((bebida, index) => (
          <div key={index} className="grid gap-1 p-2 border rounded shadow bg-white">
            <img
                src={bebida.image}
                alt={bebida.name}
                className="w-30 h-28 hover:scale-110 hover:-rotate-2 duration-200"
              />
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
