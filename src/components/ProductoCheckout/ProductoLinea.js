import React, { useState, useContext, useEffect } from "react";
import { EstadoContexto } from "../../context/EstadoGeneral";
import "./ProductoCheckout.css";  

const ProductoLinea = ({ producto }) => {
  const { eliminarProducto } = useContext(EstadoContexto);
  const [formCantidad, setFormCantidad] = useState(0); // Inicializa formCantidad en 1
  const [precioTotal, setPrecioTotal] = useState(0); // Inicializa precioTotal en 0

  useEffect(() => {
    // Verifica si el producto ya está en el carro y actualiza la cantidad y el precio
    const carro = JSON.parse(localStorage.getItem("carro")) || [];
    const productoExistente = carro.find(item => item.nombre === producto.Nombre);
    if (productoExistente) {
      setFormCantidad(productoExistente.cantidad);
      setPrecioTotal(productoExistente.precio);
    }
  }, [producto.Nombre]);

  const actualizarPrecio = (cantidad) => {
    setPrecioTotal(parseFloat(producto.Precio));
  };

  const aumentar = () => {
    if (formCantidad < producto.Cantidad) {
      const nuevaCantidad = formCantidad + 1;
      setFormCantidad(nuevaCantidad);
      actualizarPrecio(nuevaCantidad);
      guardarEnCarro(nuevaCantidad); // Guarda automáticamente en el carro
      window.location.reload();
    }
  };

  const disminuir = () => {
    if (formCantidad > 1) {
      const nuevaCantidad = formCantidad - 1;
      setFormCantidad(nuevaCantidad);
      actualizarPrecio(nuevaCantidad);
      guardarEnCarro(nuevaCantidad); // Guarda automáticamente en el carro
      window.location.reload();
    }
  };

  const guardarEnCarro = (cantidad) => {
    const carro = JSON.parse(localStorage.getItem("carro")) || [];
    const productoIndex = carro.findIndex(item => item.nombre === producto.Nombre);
    if (productoIndex !== -1) {
      // Actualiza la cantidad y el precio si el producto ya está en el carro
      carro[productoIndex].cantidad = cantidad;
      carro[productoIndex].precio = parseFloat(producto.Precio);
    } else {
      // Agrega el producto al carro si no está presente
      carro.push({
        nombre: producto.Nombre,
        cantidad: cantidad,
        precio: parseFloat(producto.Precio)
      });
    }
    localStorage.setItem("carro", JSON.stringify(carro));
  };

  const eliminarDelLocalStorage = (nombreProducto) => {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const updatedproductos = productos.filter(prod => prod.Nombre !== nombreProducto);
    localStorage.setItem("productos", JSON.stringify(updatedproductos));
    const carro = JSON.parse(localStorage.getItem("carro")) || [];
    const updatedCarro = carro.filter(prod => prod.nombre !== nombreProducto);
    localStorage.setItem("carro", JSON.stringify(updatedCarro));
  };

  const eliminarDelProducto = (productoId) => {
    eliminarProducto(productoId);
  };

  const eliminar = () => {
    eliminarDelLocalStorage(producto.Nombre); // Eliminar del localStorage
    eliminarDelProducto(producto.IdProducto); // Eliminar del contexto
    window.location.reload();
  };

  return (
    <tr>
      <td>
        <img className="imagen-tabla" src={producto.ImagenesUrl[0]} alt="" />
        <p>{producto.Nombre}</p>
      </td>
      <td>$ {producto.Precio}</td>
      <td>
        {formCantidad}
        <button
          style={{ width: "25px", height: "25px", background: "red" }}
          onClick={aumentar}
        >
          +
        </button>
        <button
          style={{ width: "25px", height: "25px", background: "black" }}
          onClick={disminuir}
        >
          -
        </button>
      </td>
      <td>
        <h3>$ {producto.Precio*formCantidad} </h3>
      </td>

      <td>
        <button
          style={{ background: "red" }}
          onClick={eliminar} // Llama a la función eliminar
        >
          Eliminar
        </button>
        <br />
        <br />
      </td>
    </tr>
  );
};

export default ProductoLinea;
