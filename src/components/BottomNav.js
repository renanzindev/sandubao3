import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUtensils, faWineGlass } from "@fortawesome/free-solid-svg-icons";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 z-50 shadow-md">
      {/* Home */}
      <Link to="/" className="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon icon={faHome} className="text-xl" />
        <span className="text-sm mt-1">Home</span>
      </Link>

      {/* Bebidas */}
      <Link to="/bebidas" className="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon icon={faWineGlass} className="text-xl" />
        <span className="text-sm mt-1">Bebidas</span>
      </Link>

      {/* Combos */}
      <Link to="/combos" className="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon icon={faUtensils} className="text-xl" />
        <span className="text-sm mt-1">Combos</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
