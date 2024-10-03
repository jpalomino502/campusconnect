import React from 'react';

const Servicios = () => {
  return (
    <div className="flex flex-col items-center min-h-screen py-8 bg-white"> {/* Fondo blanco */}
      <main id="contenedor" className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Servicios UNAB</h1>
        
        <section id="accesos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lista-accesos bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">Sistemas de información</h3>
            <ul className="list-disc pl-5 mt-2">
              <li><a href="https://miportalu.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Mi Portal U</a></li>
              <li><a href="https://cosmos.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Cosmos</a></li>
              <li><a href="https://mail.google.com/a/unab.edu.co" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Correo UNAB</a></li>
              <li><a href="http://portal.office.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Office o365</a></li>
            </ul>
          </div>

          <div className="lista-accesos bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">Servicios digitales</h3>
            <ul className="list-disc pl-5 mt-2">
              <li><a href="https://unab.edu.co/sistema-de-bibliotecas-unab/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Biblioteca</a></li>
              <li><a href="https://bienestar.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Bienestar U</a></li>
              <li><a href="https://unab.edu.co/estudiantes/#tramites" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Trámites</a></li>
              <li><a href="https://correo.unab.edu.co/recuperarClave.jsp" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Contraseña Usuario UNAB</a></li>
            </ul>
          </div>

          <div className="lista-accesos bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">Plataformas para el aprendizaje</h3>
            <ul className="list-disc pl-5 mt-2">
              <li><a href="https://canvas.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Canvas</a></li>
              <li><a href="https://www.microsoft.com/es-co/microsoft-365/microsoft-teams/group-chat-software" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Teams</a></li>
              <li><a href="https://tema.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">TEMA Pregrado</a></li>
              <li><a href="https://temaposgrados.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">TEMA Posgrado</a></li>
            </ul>
          </div>

          <div className="lista-accesos bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">Portales</h3>
            <ul className="list-disc pl-5 mt-2">
              <li><a href="https://www.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">unab.edu.co</a></li>
              <li><a href="https://unabvirtual.unab.edu.co/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">unab virtual</a></li>
              <li><a href="https://unab.edu.co/impulsa" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Impulsa</a></li>
            </ul>
          </div>
        </section>

        <section className="banner-ads mt-8 flex justify-center"> {/* Centrado */}
          <a 
            href="https://revivenew.unab.edu.co/www/delivery/ck.php?oaparams=2__bannerid=298__zoneid=18__cb=21dd3fd370__oadest=https%3A%2F%2Funab.edu.co%2Fwp-content%2Fuploads%2F2022%2F10%2FPagos-PSE-actualizada-marca-UNAB.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://revivenew.unab.edu.co/www/images/dd0d35d21bb89998f75fe68fe4572997.png" 
              width="800" 
              height="320" 
              alt="Publicidad"
              title="" 
              className="rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
            />
          </a>
        </section>
      </main>
    </div>
  );
};

export default Servicios;
