import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { EstadoContexto } from "../../context/EstadoGeneral";
import { favoritoAgregar, favoritoEliminar } from "../../controllers/Favoritos";
import EnviarWhatsAppProducto from "../../util/EnviarWhatsAppProducto";

import "./ProductoSolo.css";

const ProductoSolo = ({ producto, favorito }) => {
  const tipoImagen = producto.ImagenesUrl[0].split(".").pop().split(/|\?/)[0];
  const { agregarProducto, usuario } = useContext(EstadoContexto);
  const exiteUsuario = Object.keys(usuario).length;

  const crearCarrito = (producto) => {
    const storedProductos = JSON.parse(localStorage.getItem("productos")) || [];
    const igualesCarrito = storedProductos.some(
      (item) => item.IdProducto === producto.IdProducto
    );
    
    if (igualesCarrito) {
      console.log("Ya ha sido añadido");
    } else {
      localStorage.setItem("productos", JSON.stringify([...storedProductos, producto]));
      agregarProducto(producto);
    }
  };

  return (
    <>
      <div className="contenedor-producto">
      <a href={`/producto/${producto.UrlProducto}/${producto.IdProducto}`}>
          <img
            className="contenedor-producto-img"
            alt={"descripcion"}
            src={
              tipoImagen === "j" || tipoImagen === "p"
                ? producto.ImagenesUrl[0]
                : "/images/poster-mochila-logan.webp"
            }
          />
        </a>
        <h2>{producto.Nombre}</h2>
        <div>
          {/* <button onClick={() => EnviarWhatsAppProducto(producto)}>
            <img src="/icons/GeneralIconoWhatsApp.svg" alt="logo" />
          </button> */}
        <h3>${producto.Precio}</h3>
          <button onClick={() => crearCarrito(producto)}>
            <img src="/icons/GeneralIconoAnadirCarro.svg" alt="logo" />
          </button>
          {/* {exiteUsuario ? (
            favorito ? (
              <button
                onClick={() => favoritoEliminar(usuario.IdCliente, producto.IdProducto)}
              >
                <img src="/icons/IconoBorrar.svg" alt="logo" />
              </button>
            ) : (
              <button
                onClick={() => favoritoAgregar(usuario.IdCliente, producto)}
              >
                <img src="/icons/GeneralIconoCorazon.svg" alt="logo" />
              </button>
            )
          ) : ( */}
            {/* <button>
              <img src="/icons/GeneralIconoCorazon.svg" alt="logo" />
            </button>
          )} */}
        </div>
      </div>
    </>
  );
};

export default ProductoSolo;