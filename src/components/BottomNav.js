import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger, faUtensils, faWineGlass } from "@fortawesome/free-solid-svg-icons";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const getLinkClasses = (path) => {
    const baseClasses = "flex flex-col items-center transition-all duration-200 transform";
    const activeClasses = "text-yellow-400 scale-110";
    const inactiveClasses = "text-gray-300 hover:text-white hover:scale-105";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="fixed pt-4 bottom-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 z-50 shadow-lg border-t border-gray-700">
      {/* Home */}
      <Link 
        to="/" 
        className={getLinkClasses("/")}
        aria-label="Página de Sanduíches"
      >
        <div className="relative">
          <FontAwesomeIcon icon={faHamburger} className="text-xl" />
          {isActive("/") && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
          )}
        </div>
        <span className="text-xs mt-1 font-medium">Sanduíches</span>
      </Link>

      {/* Bebidas */}
      <Link 
        to="/bebidas" 
        className={getLinkClasses("/bebidas")}
        aria-label="Página de Bebidas"
      >
        <div className="relative">
          <FontAwesomeIcon icon={faWineGlass} className="text-xl" />
          {isActive("/bebidas") && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
          )}
        </div>
        <span className="text-xs mt-1 font-medium">Bebidas</span>
      </Link>

      {/* Combos */}
      <Link 
        to="/combos" 
        className={getLinkClasses("/combos")}
        aria-label="Página de Combos"
      >
        <div className="relative">
          <FontAwesomeIcon icon={faUtensils} className="text-xl" />
          {isActive("/combos") && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
          )}
        </div>
        <span className="text-xs mt-1 font-medium">Combos</span>
        {isActive("/combos") && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            !
          </span>
        )}
      </Link>
    </nav>
  );
};

export default BottomNav;
