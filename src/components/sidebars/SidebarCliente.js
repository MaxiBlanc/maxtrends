import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./SidebarsCliente.css";
import { EstadoContexto } from "../../context/EstadoGeneral";
const SidebarCliente = () => {
  const { cerrarSesion, usuario, sidebar, cambiarEstadoSidebar } =
    useContext(EstadoContexto);
  return (
    <>
      <div
        className={
          sidebar === false
            ? "contenedor-sidebar-perfil"
            : "contenedor-sidebar-perfil activo"
        }
        style={sidebar === true ? { zIndex: "900" } : { zIndex: "800" }}
      >
        <div className="controles-menu">
          <button onClick={() => cambiarEstadoSidebar(false)}>Regresar</button>
        </div>
        <div className="contenedor-perfil">
          <div>
            <img
              src={
                usuario.FotoUrl === "undefined" || !usuario.FotoUrl
                  ? "/images/perfil/sinPerfil.jpg"
                  : usuario.FotoUrl
              }
              alt="Avatar"
            />
          </div>
          <h4 style={{color: "black"}}>
            {usuario.Nombres !== "undefined"
              ? usuario.Nombres + " " + usuario.Apellidos
              : "Sin nombre"}
          </h4>
        </div>
        <div className="contenedor-navegacion">
        <a href="/cliente/perfil">
            <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
            <span>Mi perfil</span>
          </a>
          <a href="/cliente/direcciones">
          <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
            <span>Mis direcciones</span>
          </a>
          {/* <Link to="/cliente/personalizar">
          <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
            <span>Personalizar</span>
          </Link> */}
          <hr />
          <a href="/cliente/mis-compras">
          <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
            <span>Mis compras</span>
          </a>
          {/* <Link to="/cliente/favoritos">
          <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
            <span>Mis favoritos</span>
          </Link>
          <Link to="/cliente/guardados">
          <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
            <span>Productos guardados</span>
          </Link> */}
          <hr />
        </div>
        <div style={{ padding: "0px 10px" }}>
        <button className="boton-formulario" onClick={() => {
  cerrarSesion();
  localStorage.removeItem("carro");
  localStorage.removeItem("productos");
  window.location.href = '/ingresar'
}}>

            Cerrar Sesion
          </button>
        </div>
      </div> 
    </>
  );
};

export default SidebarCliente;
