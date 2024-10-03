import React from 'react';

const Sidebar = () => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg h-full"> {/* Elimina marginLeft para evitar problemas de alineación */}
      <h3 className="font-bold text-lg mb-4 border-b-2 border-gray-200 pb-2">Sistemas de Información</h3>
      
      {/* Sección de accesos directos */}
      <div className="lista-accesos mb-4">
        <h4 className="font-bold text-md mb-2">Accesos Directos</h4>
        <ul className="space-y-2">
          <li><a href="https://miportalu.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Mi Portal U</a></li>
          <li><a href="https://cosmos.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Cosmos</a></li>
          <li><a href="https://mail.google.com/a/unab.edu.co" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Correo UNAB</a></li>
          <li><a href="http://portal.office.com/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Office o365</a></li>
        </ul>
      </div>

      {/* Sección de servicios digitales */}
      <div className="lista-accesos mb-4">
        <h4 className="font-bold text-md mb-2">Servicios Digitales</h4>
        <ul className="space-y-2">
          <li><a href="https://unab.edu.co/sistema-de-bibliotecas-unab/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Biblioteca</a></li>
          <li><a href="https://bienestar.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Bienestar U</a></li>
          <li><a href="https://unab.edu.co/estudiantes/#tramites" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Trámites</a></li>
          <li><a href="https://correo.unab.edu.co/recuperarClave.jsp" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Contraseña Usuario UNAB</a></li>
        </ul>
      </div>

      {/* Sección de plataformas para el aprendizaje */}
      <div className="lista-accesos mb-4">
        <h4 className="font-bold text-md mb-2">Plataformas para el Aprendizaje</h4>
        <ul className="space-y-2">
          <li><a href="https://canvas.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Canvas</a></li>
          <li><a href="https://www.microsoft.com/es-co/microsoft-365/microsoft-teams/group-chat-software" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Teams</a></li>
          <li><a href="https://tema.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">TEMA Pregrado</a></li>
          <li><a href="https://temaposgrados.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">TEMA Posgrado</a></li>
        </ul>
      </div>

      {/* Sección de portales */}
      <div className="lista-accesos mb-4">
        <h4 className="font-bold text-md mb-2">Portales</h4>
        <ul className="space-y-2">
          <li><a href="https://www.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">unab.edu.co</a></li>
          <li><a href="https://unabvirtual.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">unab virtual</a></li>
          <li><a href="https://unab.edu.co/impulsa" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-orange-600 transition duration-300">Impulsa</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
