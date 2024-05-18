import React from "react";
import { Link } from "react-router-dom";
import Slideshow from "./componentes/Slideshow";
import "./Slider.css";
 
const slider = [
  {
    id: 111,
    nombre: "Buzo con capucha",
    descripcion: "Adidas",
    color: "#2e311c",
    imgURL: "/images/slider/buzoadi2.png",
  },
  {
    id: 112,
    nombre: "Buzo con capucha",
    descripcion: "Adidas",
    color: "#030619",
    imgURL: "/images/slider/buzoadi.png",
  },
  {
    id: 113,
    nombre: "Zapatillas",
    color: "black",
    descripcion: "Nike",
    imgURL: "/images/slider/zapanike.png",
  },
  {
    id: 114,
    nombre: "Zapatillas",
    color: "#9f601d",
    descripcion: "Adidas",
    imgURL: "/images/slider/zapaadi1.png",
  },
];

const Slider = () => {
  return (
    <div className="contenedor-slider">
      <Slideshow velocidad="1000" intervalo="15000">
        {slider.map((slider) => (
          <div
            className="contenedor-imagen-descripcion"
            key={slider.id}
            style={{ backgroundColor: slider.color }}
          >
            <div
              className="contenedor-slider-descripcion"
              style={{ marginRight: "10%" }}
            >
              <div className="contenedor-datos-descripcion">
                <h2>{slider.nombre} </h2>
                <p>{slider.descripcion} </p>
                <a href={`/tienda`}>
                  <button>Ver ahora</button>
                </a>
              </div>
            </div>
            <div className="contenedor-slider-imagen">
              <img src={slider.imgURL} alt="" />
            </div>
          </div>
        ))}
      </Slideshow>
    </div>
  );
};

export default Slider;
