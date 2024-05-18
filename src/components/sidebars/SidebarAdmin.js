import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Sidebars.css";
import { EstadoContexto } from "../../context/EstadoGeneral";
const SidebarAdmin = () => {
  const { cerrarSesion, usuario } = useContext(EstadoContexto);
  const [isToggled, setToggled] = useState(false);
  const toggleTrueFalse = () => setToggled(!isToggled);
  return (
    <>
      <div className="menu-administrador">
        <button>
          <img onClick={toggleTrueFalse} src="/icons/menu/GeneralIconoMenu.svg" alt="logo" />
        </button>
        <div>
        <a href="/">
            <img src="/icons/sidebar/X.png" alt="logo" />
          </a>
        </div>
      </div>
      <div 
        className={
          isToggled === false
            ? "contenedor-sidebar"
            : "contenedor-sidebar activo"
        }
      >
        <div className="contenedor-perfil">
          <div>
            <img src="/images/perfil/perfilLogan.jpg" alt="Avatar" />
          </div>
          <h4>{usuario.Nombres !== "undefined"
              ? usuario.Nombres
              : "Sin nombre"}</h4>
          <p>Gerente</p>
        </div>

        <div className="contenedor-rol">
          <p>ADMINISTRADOR</p>
        </div>

        <div className="contenedor-navegacion">
          <ul>
            <li className="navegacion-items">
            <a href="/administrador/categorias">
                <img src="/icons/sidebar/SidebarIconoCategoria.svg" alt="logo" />
                Categorias
              </a>
              <a href="/administrador/modelos">
                <img src="/icons/sidebar/SidebarIconoEtiqueta.svg" alt="logo" />
                Marcas
              </a>
              <a href="/administrador/productos">
                <img src="/icons/sidebar/SidebarIconoProducto.svg"alt="logo" />
                Productos
              </a>
              <a href="/administrador/pedidos">
                <img src="/icons/sidebar/SidebarIconoEtiqueta.svg" alt="logo" />
                Pedidos
              </a>
              <a href="/administrador/clientes">
                <img src="/icons/sidebar/SidebarIconoCliente.svg" alt="logo" />
                Clientes
              </a>
              <a href="/administrador/personales">
                <img src="/icons/sidebar/SidebarIconoPersonal.svg" alt="logo" />
                Personales
              </a>
              <a href="/administrador/reportes">
                <img src="/icons/sidebar/SidebarIconoReporte.svg" alt="logo" />
                Reportes
              </a>
            </li>
          </ul>
          <button className="boton-formulario" onClick={() => {
  cerrarSesion();
  localStorage.removeItem("carro");
  localStorage.removeItem("productos");
  setTimeout(function() {
    window.location.href = '/ingresar/administrador'
}, 1500);
}}>Cerrar Sesion</button>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
