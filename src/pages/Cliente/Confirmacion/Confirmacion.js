import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { EstadoContexto } from "../../../../src/context/EstadoGeneral";
import { useLocation } from "react-router-dom";
import { agregarCarrito, agregarPedido } from "../../../controllers/Carrito";
import { carritoTraerUno } from "../../../controllers/Carrito";
import { useHistory  } from "react-router-dom";
let functionsPagarMP =
  "http://localhost:5001/ecommerce-logan-ee1e8/us-central1/creaPagoMP";

const Confirmacion = () => {
  const history = useHistory();
  const [compraExitosa, setCompraExitosa] = useState("esperando");
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  let payment_id = query.get("payment_id");
  let status = query.get("status");
  const idCliente = localStorage.getItem("IdCliente");
  const [carro, setCarro] = useState([]);
  const { usuario, eliminarCarrito } = useContext(EstadoContexto);

  function obtenerCarroDesdeLocalStorage() {
    // Obtener el carrito del almacenamiento local y parsearlo como JSON
    const carroLocalStorage = JSON.parse(localStorage.getItem("carro"));
    setCarro(carroLocalStorage);
   
}

useEffect(() => {
  if (payment_id !== null && status === "approved") {
    obtenerCarroDesdeLocalStorage();
  }
}, [payment_id, status]);

useEffect(() => { 
  let carritoAgregado = false; 

  if (carro.length !== 0 && !carritoAgregado) {
    agregarCarrito(JSON.parse(localStorage.getItem("totalapagar")), usuario, carro, JSON.parse(localStorage.getItem("direccion")), JSON.parse(localStorage.getItem("numeroPedido")));
    agregarPedido(JSON.parse(localStorage.getItem("totalapagar")), usuario, carro, JSON.parse(localStorage.getItem("direccion")), JSON.parse(localStorage.getItem("numeroPedido")));
    carritoAgregado = true;

    // Limpiar el carrito en el almacenamiento local después de agregarlo
    localStorage.removeItem("carro");
    localStorage.removeItem("productos");
    localStorage.removeItem("direccion");
    localStorage.removeItem("totalapagar");
    localStorage.removeItem("numeroPedido");
  }
}, [carro, usuario]);

function obtenerCarroDesdeLocalStorage() {
  const carroLocalStorage = JSON.parse(localStorage.getItem("carro")) || [];
  setCarro(carroLocalStorage);
}


  useEffect(() => { 
    (async () => {
      if (payment_id !== null && status === "approved") {
        // obtenerCarroDesdeLocalStorage();
        // console.log(JSON.parse(localStorage.getItem("carro")))
        // if(carro.length !== 0){ 
        //   agregarCarrito(0, usuario, carro, "cochabamba 123");
        // }
        const carritoDB = await carritoTraerUno(idCliente);
        //console.log("FRONT: ", carritoDB)
        const pedido = {
          payment_id: payment_id,
          status: status,
          carritoDB: carritoDB,
        };

        const request = await Axios({
          method: "post",
          baseURL: functionsPagarMP,
          data: JSON.stringify(pedido),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3001",
          },
          withCredentials: true,
        });
        //"Access-Control-Allow-Origin": "https://mochilaslogan.com",

        if (request.data) {
          setCompraExitosa("comprado");
          setTimeout(() => {
            history.push(`/cliente/mis-compras`);
          }, 4000);
        } else {
          console.log("No se puedo comprar");
          setCompraExitosa("error");
        }
      }
    })();
  }, [payment_id, status, idCliente, history]);

  return (
    <>
      <div className="titulo-paginas">
        <h1>CONFIRMACIÓN DEL PEDIDO</h1>
      </div>
      <h1>Gracias por su compra :)</h1>
      {/* {compraExitosa === "esperando" && <h3>Procesando....</h3>}
      {compraExitosa === "comprado" && <h3>Gracias por comprar</h3>}
      {compraExitosa === "error" && <h3>Error en la compra</h3>} */}
    </>
  );
};

export default Confirmacion;
