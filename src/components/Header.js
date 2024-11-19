import React from "react";
import garfieldImage from "../assets/garfield.jpeg";
import { Link } from "react-router-dom"; // Para navegação



const Header = () => {
  return (
    <header className="w-full h-auto bg-zinc-900 bg-center pb-4 mb-3">
      <div className="w-full h-auto flex flex-col justify-center items-center">
        <img
          src={ garfieldImage}
          alt="Garfield"
          className="w-36 h-32 object-cover rounded-full hover:scale-110 duration-200"
        />
        <h1 className="text-4xl mt-4 mb-2 font-bold text-white hover:scale-110 duration-100">
          Sandubão 3
        </h1>
        <span className="text-white hover:scale-110 duration-100">
          Av. Ibirapuera Nº250, Itaipu, BH
        </span>
        <span className="text-white hover:scale-110 duration-100">📞 (31) 9694-0548</span>
        <div className="bg-green-500 px-4 py-1 rounded-lg mt-4 text-white">
          <span className="font-medium">Seg a Dom - 18:00 as 02:00</span>
        </div>
      </div>
    </header>
  );
};

export default Header;