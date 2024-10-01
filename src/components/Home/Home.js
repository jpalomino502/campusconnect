// App.js
import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const news = [
  {
    title: "Noticia 1",
    image: "https://via.placeholder.com/800x400?text=Noticia+1",
    description: "Descripción de la Noticia 1"
  },
  {
    title: "Noticia 2",
    image: "https://via.placeholder.com/800x400?text=Noticia+2",
    description: "Descripción de la Noticia 2"
  },
  {
    title: "Noticia 3",
    image: "https://via.placeholder.com/800x400?text=Noticia+3",
    description: "Descripción de la Noticia 3"
  }
];

const posts = [
  { id: 1, title: "Publicación 1", content: "Contenido de la publicación 1" },
  { id: 2, title: "Publicación 2", content: "Contenido de la publicación 2" },
  { id: 3, title: "Publicación 3", content: "Contenido de la publicación 3" }
];

const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="container mx-auto p-4">
      {/* Carrusel de noticias */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Últimas Noticias</h2>
        <Slider {...sliderSettings}>
          {news.map((item, index) => (
            <div key={index} className="p-2">
              <img src={item.image} alt={item.title} className="rounded-lg w-full h-64 object-cover" />
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Publicaciones */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Publicaciones Recientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.content}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Leer más</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
