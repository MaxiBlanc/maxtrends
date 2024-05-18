import React, { useState, useEffect, useContext } from "react";
import { EstadoContexto } from "../../../context/EstadoGeneral";
import { pedidosTodos } from "../../../controllers/Pedidos";
import { PDFViewer } from "@react-pdf/renderer";
import Recibo from "../../Cliente/Compras/Recibo";
import "../../Cliente/Compras/Compras";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../db/firebase";


const coleccion = "Pedido";
// onClick={actualizarEstadoPedido(pedido.idCliente, pedido.NumeroPedido, pedido.Estado)}

export const actualizarEstadoCarrito = async (idCliente, numeroPedido, nuevoEstado) => {
  try {
    // Paso 1: Obtener referencia al documento del cliente
    const clienteRef = doc(db, "Clientes", idCliente);
    
    // Paso 2: Acceder a la subcolección "Carrito" dentro del documento del cliente
    const carritoRef = collection(clienteRef, "Carrito");
    
    // Paso 3: Realizar consulta para encontrar el documento con el número de pedido coincidente
    const queryPedido = query(carritoRef, where("NumeroPedido", "==", numeroPedido));
    const pedidoSnapshot = await getDocs(queryPedido);
    
    // Paso 4: Actualizar el campo "Estado" del documento encontrado
    pedidoSnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { Estado: nuevoEstado });
    });
    console.log(numeroPedido);
    console.log("Estado del pedido actualizado correctamente");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
  }
};

export const actualizarEstadoPedido = async (numeroPedido, nuevoEstado) => {
  try {
    // Paso 1: Realizar consulta para encontrar el documento con el número de pedido coincidente
    const pedidosRef = collection(db, "Pedido");
    const queryPedido = query(pedidosRef, where("NumeroPedido", "==", numeroPedido));
    const pedidoSnapshot = await getDocs(queryPedido);
    
    // Paso 2: Actualizar el campo "Estado" del documento encontrado
    pedidoSnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { Estado: nuevoEstado });
    });

    console.log(numeroPedido);
    console.log("Estado del pedido actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
  }
};


export const pedidosTodosPedido = async () => {
  const pedidosRef = collection(db, coleccion);
  const queryPedidos = query(pedidosRef, orderBy("Fecha", "desc"));
  const pedidosDB = await getDocs(queryPedidos);
  const resultado = pedidosDB.docs.map((doc) => ({
    IdPedido: doc.id,
    ...doc.data(),
  }));
  return resultado;
};


const Pedidos = () => {
  const { usuario } = useContext(EstadoContexto);
  const [verRecibo, setVerRecibo] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [infoPedido, setInfoPedido] = useState();
  useEffect(() => {
    (async () => {
      const pedidosDB = await pedidosTodosPedido(usuario.IdCliente);
      setPedidos(pedidosDB);
    })();
  }, [usuario]);
  const mostrarRecibo = (pedido) => {
    setVerRecibo(true);
    setInfoPedido(pedido);
  };
  return (
    <>
      <div className="titulo-paginas">
        <h1>MIS PEDIDOS</h1>
      </div>
      {verRecibo ? (
        <div className="contendor-pdf">
          <button
            onClick={() => setVerRecibo(false)}
            style={{
              color: "white",
              backgroundColor: "red",
              padding: "5px",
              fontSize: "16px",
              fontWeight: "bolder",
            }}
          >
            Cerrar COMPROBANTE DE PAGO "( X )"
          </button>
          <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <Recibo pedido={infoPedido} />
          </PDFViewer>
        </div>
      ) : null}
      {pedidos?.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        <>
          {pedidos.map((pedido) => (
            <div key={pedido.IdPedido} className="contenedor-pedido">
              <div className="titulo-pedido">
                <div>
                  <p>N° Pedido: {pedido.NumeroPedido}</p>
                  <span>|</span>
                  <p>Fecha: {pedido.Fecha.toDate().toLocaleDateString()}</p>
                  <span>|</span>
                  <p style={{ fontWeight: "700" }}>
                    Monto total: $ {pedido.Total}.00{" "}
                  </p>
                  {/* <button
                    onClick={() => mostrarRecibo(pedido)}
                    style={{ color: "white", backgroundColor: "red" }}
                  >
                    Ver recibo
                  </button> */}
                </div>
                <div>
                  <button
                    style={
                      pedido.Estado === "pedido"
                        ? { color: "white", backgroundColor: "red" }
                        : { color: "black", backgroundColor: "white" }
                    }
                    onClick={() => {
                      console.log(pedido.Estado);
                      actualizarEstadoPedido(pedido.NumeroPedido, "pedido");
                      actualizarEstadoCarrito(pedido.IdCliente, pedido.NumeroPedido, "pedido");
                      // window.location.reload();
                    }}
                  >
                    Pedido
                  </button>
                  <button
                     style={
                      pedido.Estado === "ruta"
                        ? { color: "white", backgroundColor: "red" }
                        : { color: "black", backgroundColor: "white" }
                    }
                    onClick={() => {
                      console.log(pedido.Estado);
                      actualizarEstadoPedido(pedido.NumeroPedido, "ruta");
                      actualizarEstadoCarrito(pedido.IdCliente, pedido.NumeroPedido, "ruta");
                      // window.location.reload();
                    }}
                  >
                    Ruta
                  </button>
                  <button
                    style={
                      pedido.Estado === "entregado"
                        ? { color: "white", backgroundColor: "red" }
                        : { color: "black", backgroundColor: "white" }
                    }
                    onClick={() => {
                      console.log(pedido.Estado);
                      actualizarEstadoPedido(pedido.NumeroPedido, "entregado");
                      actualizarEstadoCarrito(pedido.IdCliente, pedido.NumeroPedido, "entregado");
                      // window.location.reload();
                    }}
                  >               
                    Entregado
                  </button>
                </div>
              </div>
              <div className="productos-pedido">
                {pedido.Productos.map((producto) => (
                  <div
                    key={producto.IdProducto}
                    style={{ marginBottom: "5px" }}
                  >
                    {/* <img src={producto.ImagenesUrl[0]} alt="" /> */}
                    <p>{producto.nombre}</p>
                    <span>|</span>
                    <p>Cantidad: {producto.cantidad}</p>
                    <span>|</span>
                    <p style={{ fontWeight: "700" }}>
                      Precio: $ {producto.precio}.00{" "}
                    </p>{" "}
                  </div>
                ))}
              </div>
              <hr />
              <div style={{ padding: "8px" }}>
                <label>Destinatario: </label>
                <span>{pedido.Nombres + pedido.Apellidos}</span>
                <br />
                <label>Celular: </label>
                <span>{pedido.Celular ? pedido.Celular : ""}</span>
                <br />
                {typeof pedido.Direccion === "object" ? (
                  <>
                    <hr />

                    <p
                      style={{
                        padding: "5px 0px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Producto enviado a tu dirección
                    </p>
                    <hr />
                    <label>Región: </label>
                    <span>{pedido.Direccion.region}</span>
                    <br />
                    <label>Provincia: </label>
                    <span>{pedido.Direccion.provincia}</span>
                    <br />
                    <label>Distrito: </label>
                    <span>{pedido.Direccion.distrito}</span>
                    <br />
                    <label>Dirección: </label>
                    <span>{pedido.Direccion.direccion}</span>
                    <br />
                    <label>Recomendación de envio: </label>
                    <span>{pedido.Direccion.recomendacion}</span>
                  </>
                ) : (
                  <>
                    <hr />

                    <p
                      style={{
                        padding: "5px 0px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Producto para recoger en Tienda Logan
                    </p>
                    <hr />
                    <label>Dirección tienda LOGAN: </label>
                    <span>{pedido.Direccion}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Pedidos;
// import React, { useState, useEffect } from "react";
// import { db } from "../../../db/firebase";
// import {
//   collectionGroup,
//   onSnapshot,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { pedidoEditar } from "../../../controllers/Pedidos";
// import ReactExport from "react-export-excel";
// import "./Pedidos.css";
// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
// const Pedidos = () => {
//   const [pedidos, setPedidos] = useState([]);
//   const [pedidosExcel, setPedidosExcel] = useState([]);
//   const [cambiar, setCambiar] = useState(false);

//   useEffect(() => {
//     const pedidosRef = collectionGroup(db, "Pedidos");
//     const queryPedidos = query(pedidosRef, orderBy("Fecha", "desc"));
//     onSnapshot(queryPedidos, (snapshot) => {
//       setPedidos(
//         snapshot.docs.map((doc) => ({
//           IdPedido: doc.id,
//           ...doc.data(),
//         }))
//       );
//     });
//     setCambiar(true);
//   }, [setCambiar]);

//   useEffect(() => {
//     if (cambiar) { 
//       const cambiadoExcel = pedidos.map((doc) => {
//         const arregloProductos = doc.Productos.map((producto) => {
//           return producto.Nombre;
//         });
//         const juntarProductos = arregloProductos.toString();
//         Object.assign(doc, { Productos2: juntarProductos });
//         return {
//           IdPedido: doc.id,
//           Fecha2: doc.Fecha.toDate().toLocaleDateString(),
//           ...doc,
//         };
//       });
//       setPedidosExcel(cambiadoExcel);
//     }
//   }, [cambiar, pedidos]);

//   const cambiarRuta = (IdCliente, IdPedido) => {
//     const estado = "ruta";
//     pedidoEditar(IdCliente, IdPedido, estado);
//   };
//   const cambiarPedido = (IdCliente, IdPedido) => {
//     const estado = "pedido";
//     pedidoEditar(IdCliente, IdPedido, estado);
//   };
//   const cambiarEntregado = (IdCliente, IdPedido) => {
//     const estado = "entregado";
//     pedidoEditar(IdCliente, IdPedido, estado);
//   };

//   return (
//     <>
//       <h2>Pedidos</h2>
//       {pedidos?.length === 0 ? (
//         <p>No hay pedidos</p>
//       ) : (
//         <>
//           {pedidosExcel?.length !== 0 && (
//             <div>
//               <ExcelFile
//                 element={
//                   <button className="boton-mediano">Descargar excel</button>
//                 }
//                 filename="Listado de pedidos"
//               >
//                 <ExcelSheet data={pedidosExcel} name="Pedidos">
//                   <ExcelColumn label="Numero de pedido" value="IdPedido" />
//                   <ExcelColumn label="Fecha" value="Fecha2" />
//                   <ExcelColumn label="Nombres" value="Nombres" />
//                   <ExcelColumn label="Apellidos" value="Apellidos" />
//                   <ExcelColumn label="Celular" value="Celular" />
//                   <ExcelColumn label="Estado" value="Estado" />
//                   <ExcelColumn label="Monto pagado" value="Total" />
//                   <ExcelColumn label="Productos" value="Productos2" />
//                 </ExcelSheet>
//               </ExcelFile>
//             </div>
//           )}
//           {pedidos.map((pedido) => (
//             <div key={pedido.IdPedido} className="contenedor-pedido">
//               <div className="titulo-pedido">
//                 <div>
//                   <p>N° Pedido: {pedido.NumeroPedido}</p>
//                   <span>|</span>
//                   <p>Fecha: {pedido.Fecha.toDate().toLocaleDateString()}</p>
//                   <span>|</span>
//                   <p style={{ fontWeight: "700" }}>
//                     Monto total: S/. {pedido.Total}.00{" "}
//                   </p>
//                 </div>
//                 <div>
//                   <button
//                     style={
//                       pedido.Estado === "pedido"
//                         ? { color: "white", backgroundColor: "red" }
//                         : { color: "black" }
//                     }
//                     onClick={() =>
//                       cambiarPedido(pedido.IdCliente, pedido.IdPedido)
//                     }
//                   >
//                     Pedido
//                   </button>
//                   <button
//                     style={
//                       pedido.Estado === "ruta"
//                         ? { color: "white", backgroundColor: "red" }
//                         : { color: "black" }
//                     }
//                     onClick={() =>
//                       cambiarRuta(pedido.IdCliente, pedido.IdPedido)
//                     }
//                   >
//                     Ruta
//                   </button>
//                   <button
//                     style={
//                       pedido.Estado === "entregado"
//                         ? { color: "white", backgroundColor: "red" }
//                         : { color: "black" }
//                     }
//                     onClick={() =>
//                       cambiarEntregado(pedido.IdCliente, pedido.IdPedido)
//                     }
//                   >
//                     Entregado
//                   </button>
//                 </div>
//               </div>
//               <div className="productos-pedido">
//                 {pedido.Productos.map((producto) => (
//                   <div
//                     key={producto.IdProducto}
//                     style={{ marginBottom: "5px" }}
//                   >
//                     <img src={producto.ImagenesUrl[0]} alt="" />
//                     <p>{producto.Nombre}</p>
//                     <span>|</span>
//                     <p>Cantidad: {producto.Unidades}</p>
//                     <span>|</span>
//                     <p style={{ fontWeight: "700" }}>
//                       Precio: S/. {producto.Precio}.00{" "}
//                     </p>{" "}
//                   </div>
//                 ))}
//               </div>
//               <hr />
//               <div style={{ padding: "8px" }}>
//                 <label>Destinatario: </label>
//                 <span>{pedido.Nombres + pedido.Apellidos}</span>
//                 <br />
//                 <label>Celular: </label>
//                 <span>{pedido.Celular ? pedido.Celular : ""}</span>
//                 <br />
//                 {typeof pedido.Direccion === "object" ? (
//                   <>
//                     <hr />

//                     <p
//                       style={{
//                         padding: "5px 0px",
//                         color: "red",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Producto enviado a tu dirección
//                     </p>
//                     <hr />
//                     <label>Región: </label>
//                     <span>{pedido.Direccion.region}</span>
//                     <br />
//                     <label>Provincia: </label>
//                     <span>{pedido.Direccion.provincia}</span>
//                     <br />
//                     <label>Distrito: </label>
//                     <span>{pedido.Direccion.distrito}</span>
//                     <br />
//                     <label>Dirección: </label>
//                     <span>{pedido.Direccion.direccion}</span>
//                     <br />
//                     <label>Recomendación de envio: </label>
//                     <span>{pedido.Direccion.recomendacion}</span>
//                   </>
//                 ) : (
//                   <>
//                     <hr />

//                     <p
//                       style={{
//                         padding: "5px 0px",
//                         color: "red",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Producto para recoger en Tienda Logan
//                     </p>
//                     <hr />
//                     <label>Dirección tienda LOGAN: </label>
//                     <span>{pedido.Direccion}</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </>
//       )}{" "}
//     </>
//   );
// };

// export default Pedidos;

// /*
// onSnapshot(queryPedidos, (snapshot) => {
//       setPedidos(
//         snapshot.docs.map((doc) => ({
//           IdPedido: doc.id,
//           ...doc.data(),
//         }))
//       );
//     });

// */
