import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { EstadoContexto } from "../../context/EstadoGeneral";
import { agregarCarrito } from "../../controllers/Carrito";
import EnviarWhatsAppCarrito from "../../util/EnviarWhatsAppCarrito";
import CargandoPagina from "./CargandoPagina";
import "./FormularioPagar.css";


let functionGenerarID =
 "https://us-central1-ecommerce-logan-ee1e8.cloudfunctions.net/crearIdMP";



const FormularioPagar = ({ direccion }) => {
  const [cargando, setCargando] = useState(false);
  const { usuario, eliminarCarrito } = useContext(EstadoContexto);
  const exiteUsuario = Object.keys(usuario).length;
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [carro, setCarro] = useState([]);

  const idCliente = localStorage.getItem("IdCliente");

  useEffect(() => {
    // Obtener el carro del local storage
    const carroLocalStorage = JSON.parse(localStorage.getItem("carro")) || [];
    setCarro(carroLocalStorage);
    
    // Calcular la cantidad total de productos y el total a pagar
    let totalCantidad = 0;
    let totalPrecio = 0;
    carroLocalStorage.forEach((producto) => {
      totalCantidad += producto.cantidad || 0;
      totalPrecio += producto.precio*producto.cantidad || 0;
    });
    // Actualizar los estados con los nuevos valores
    setCantidadProductos(totalCantidad);
    setTotalAPagar(totalPrecio);
  }, []);

  const pagarMercadoPago = async () => {
    if (exiteUsuario) {
      try {
        const request = await Axios.post(functionGenerarID, carro, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3001/",
          },
          withCredentials: true,
        });
  
        if (request.data && request.data.url) {
          // Agregar la compra al carrito y redirigir a MercadoPago
          // agregarCarrito(totalAPagar, usuario, carro, direccion);
          window.location.href = request.data.url;
        } else {
          console.log("Hubo un error con Mercado Pago");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud a Firebase:", error);
      }
    } else {
      console.log("Debe registrarse para comprar");
    }
  };
  

  return (
    <>
      <div className="formulario-pagar">
        {cargando && <CargandoPagina />}

        <div className="formulario-pagar-titulo">
          <h3>RESUMEN PEDIDO</h3>
        </div>
        <div className="contenedor-resultado">
          <p>Cantidad productos: </p>
          <span style={{ color: "red" }}>{cantidadProductos}</span>
        </div>
        <div className="contenedor-resultado">
          <p>Total a pagar: </p>
          <span style={{ color: "red" }}>$ {totalAPagar}</span>
        </div>
        <div className="contenedor-resultado">
          <p>Envío: </p>
          <span style={{ color: "black" }}>A tratar</span>
        </div>
        <div className="contenedor-boton-pagar">
          <button
            className="boton-formulario"
            onClick={() => {
              pagarMercadoPago();
              localStorage.setItem("totalapagar", JSON.stringify(totalAPagar));
              localStorage.setItem("direccion", JSON.stringify(direccion));
              localStorage.setItem("numeroPedido", JSON.stringify("00" + Date.now()));
              // agregarCarrito(totalAPagar, usuario, carro, direccion);
            }}
            
          >
            Pagar ahora
          </button>
        </div> 
        <div className="contenedor-descripcion-imagen">
          <img src="/images/pagos/tarjeta-visa-mastercard.jpg" alt="" />
        </div>
        <div className="contenedor-descripcion-imagen">
          <img src="/images/pagos/compra-y-participa.jpg" alt="" />
        </div>
        <div className="contenedor-boton-ayuda">
          <button
            onClick={() => EnviarWhatsAppCarrito(carro, totalAPagar)}
            className="card-empresa-iconos"
          > 
            <img src="/icons/GeneralIconoWhatsApp.svg" alt="logo" />
            <p>Ayuda al WhatsApp 3447465234</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default FormularioPagar;
