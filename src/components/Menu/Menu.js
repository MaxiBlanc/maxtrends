import React, { useState, useContext } from "react";
import "./Menu.css";
import { Link, useHistory  } from "react-router-dom";
import apiCategoria from "./apiCategoria";
import { EstadoContexto } from "../../context/EstadoGeneral";
import CalcularPantalla from "../../util/CalcularPantalla";

export default function Menu() {
  const history = useHistory();
  const { productos, usuario, cambiarEstadoSidebar } =
    useContext(EstadoContexto);
  const exiteUsuario = Object.keys(usuario).length;

  const [formBusqueda, setFormBusqueda] = useState("");
  const { ancho } = CalcularPantalla();
  const [dataCategoria] = useState(apiCategoria);

  const cambiarDatosBusqueda = (e) => {
    setFormBusqueda(e.target.value);
  };
  const [botonCategoria, setBotonCategoria] = useState(false);

  const [botonHamburguesa, setBotonHamburguesa] = useState(false);
  const cambiarBotonHamburguesa = () => {
    setBotonCategoria(false);
    setBotonSubcategoria(false);
    setBotonHamburguesa(!botonHamburguesa);
    cambiarEstadoSidebar(false);
  };

  const [botonPerfil, setBotonPerfil] = useState(true);
  const cambiarEstadoBotonPerfil = () => {
    setBotonPerfil(!botonPerfil);
    cambiarEstadoSidebar(true);
  };

  const [botonSubcategoria, setBotonSubcategoria] = useState(false);

  const estadoBotonCerrar = () => {
    setBotonHamburguesa(false);
    setBotonCategoria(false);
    setBotonSubcategoria(false);
  };

  const [tipoCategoria, setTipoCategoria] = useState({
    menuCategoria: "maletines",
  });

  const activarCategoria = (e) => {
    setTipoCategoria({
      ...tipoCategoria,
      menuCategoria: e.target.dataset.categoria,
    });
  };

    const redirigeCheckout = () => {
      window.location.href = "/checkout";
    };

  const buscarProducto = (e) => {
    console.log(formBusqueda)
    history.push(`/tienda?producto=${formBusqueda}`);
    setFormBusqueda("");
  };

  const cantidadProductosEnLocalStorage = JSON.parse(localStorage.getItem("productos"))?.length || 0;


  return (
    <>
      <nav className="grid-menu-principal">
        <div className="grid-menu-logo">
          {/*CONTENEDOR BOTON MENU*/}
          <div className="contenedor-menu-boton">
            {ancho <= 800 ? (
              <>
                <img
                  src="/icons/menu/GeneralIconoMenu.svg"
                  alt="logo"
                  onClick={cambiarBotonHamburguesa}
                />
                <span>Menú</span>
              </>
            ) : (
              <></>
            )}
          </div>

          {/*CONTENEDOR LOGO*/}
          <div className="contenedor-menu-logo">
            {ancho <= 500 ? (
              <a href="/">
                <img src="/iconoLogan.png" alt="" />
              </a>
            ) : (
              <a href="/">
                <img src="/logoLogan.png" alt="" />
              </a>
            )}
          </div>
        </div>
        {/*CONTENEDOR BUSCADOR*/}
        <div className="grid-menu-buscador">
          <div className="formulario-buscar">
            <input
              onChange={cambiarDatosBusqueda}
              placeholder="Buscar productos"
              size="15"
              type="text"
              value={formBusqueda}
            />
            <button
              disabled={!formBusqueda}
              className="btn"
              onClick={buscarProducto}
            >
              {formBusqueda ? (
                <a href="/busqueda">
                  <img src="/icons/menu/GeneralIconoBuscar.svg" alt="logo" />
                </a>
              ) : (
                <img src="/icons/menu/GeneralIconoBuscar.svg" alt="logo" />
              )}
            </button>
          </div>
        </div>
        <div
          className={
            botonHamburguesa && ancho <= 1000
              ? "grid-menu-links grid-menu-links-activo"
              : "grid-menu-links"
          }
        >
          {/*CONTENEDOR BOTON CATEGORIAS*/}
          <div
            className="contenedor-menu-hamburguesa"
            onClick={() => setBotonCategoria(!botonCategoria)}
            //onMouseEnter={estadoEncimaMenuCategoria}
          >
            <img src="/icons/menu/GeneralIconoMenu.svg" alt="logo" />
            <span>Categorías</span>
          </div>

          {/*CONTENEDOR MENU LINKS*/}
          <div className="contenedor-menu-links">
            {ancho <= 800 && (
              <>
                <p onClick={() => setBotonCategoria(!botonCategoria)}>
                  Categorías
                </p>

                {exiteUsuario ? (
                  usuario.Rol === "administrador" ? (
                    <a href="/administrador/reportes">Perfil</a>
                  ) : (
                    <p onClick={cambiarEstadoBotonPerfil}>Perfil</p>
                  )
                ) : (
                  <></>
                )}
                <hr />

                {!exiteUsuario && (
                  <>
                    <a href="/registrar">Registrar</a>
                    <a href="/ingresar">Ingresar</a>
                    <hr />
                  </>
                )}
              </>
            )}
            <a href="/tienda">Tienda</a>
            {/*
            <Link to="/nosotros">Nosotros</Link>
            */}
            {/*<Link to="/contacto">Contacto</Link>*/}
          </div>
        </div>

        {/*CONTENEDOR ICONOS*/}
        <div className="grid-menu-iconos">
          {exiteUsuario ? (
            usuario.Rol === "administrador" ? (
              <a href="/administrador/reportes" className="icono-perfiles">
                <img src="/icons/menu/GeneralIconoPerfil.svg" alt="logo" />
              </a>
            ) : (
              <a href="/cliente/perfil" className="icono-perfiles">
                <img src="/icons/menu/GeneralIconoPerfil.svg" alt="logo" />
              </a>
            )
          ) : (
            <a href="/registrar" className="icono-perfiles">
              <img src="/icons/menu/GeneralIconoIngresar.svg" alt="logo" />
            </a>
          )} 
          {/* <Link to="/checkout">
            <img src="/icons/menu/GeneralIconoCarrito.svg" alt="logo" />
            <span>
              <p>{productos?.length}</p>
            </span>
          </Link> */}

    <div onClick={redirigeCheckout}  style={{ cursor: "pointer" }}>
      <img src="/icons/menu/GeneralIconoCarrito.svg" alt="logo" />
      <span>
        <p>{cantidadProductosEnLocalStorage}</p>
      </span>
    </div>
        </div>
      </nav>
      
      {botonCategoria && (
        <div className="contenedor-categorias-secundario">
          {/* GRID CATEGORIA Y SUBCATEGORIA */}
          <div
            className="grid-categorias-secundario"
            //onMouseLeave={estadoEncimaMenu}
          >
            {/* GRID AREA CATEGORIA */}
            <div
              className={
                botonCategoria && ancho <= 1000
                  ? "grid-categorias-menu grid-categorias-menu-activo"
                  : "grid-categorias-menu"
              }
            >
              <div className="controles-menu">
                <button onClick={() => setBotonCategoria(!botonCategoria)}>
                  Regresar
                </button>
              </div>
              {dataCategoria.map((categoria) => (
                <p
                  key={categoria.id}
                  data-categoria={categoria.urlCategoria}
                  onMouseOver={activarCategoria}
                  onClick={() => setBotonSubcategoria(!botonSubcategoria)}
                  style={
                    categoria.urlCategoria === tipoCategoria.menuCategoria
                      ? { color: "red", fontWeight: "bold" }
                      : { color: "black" }
                  }
                >
                  {categoria.nombreCategoria}
                </p>
              ))}
            </div>

            {/* GRID AREA SUB CATEGORIA */}
            <div
              className={
                botonSubcategoria && ancho <= 1000
                  ? "contenedor-subcagorias contenedor-subcagorias-activo"
                  : "contenedor-subcagorias"
              }
            >
              <div className="controles-menu">
                <button
                  onClick={() => setBotonSubcategoria(!botonSubcategoria)}
                >
                  Regresar
                </button> 
                <button onClick={estadoBotonCerrar}>Cerrar</button>
              </div>

              {/* GRID REPETIDO */}
              {dataCategoria.map((categoria, index) => (
                <div
                  key={categoria.id}
                  data-categoria={categoria.urlCategoria}
                  className={
                    categoria.urlCategoria === tipoCategoria.menuCategoria
                      ? "grid-subcategorias-menu grid-subcategorias-menu-activo"
                      : "grid-subcategorias-menu"
                  }
                >
                  <>
                    {/* LINKS SUBCATEGORIA */}
                    <div className="contenedor-subcategorias-menu">
                      <h3 className="subtitulo">{categoria.nombreCategoria}</h3>
                      {dataCategoria[index].subCategoria.map((subCategoria) => (
                        <a href="/tienda"
                          key={subCategoria.idSubCategoria}
                          //to={`/producto/${subCategoria.urlSubCategoria}`}
                        >
                          {subCategoria.nombreSubCategoria}
                        </a>
                      ))}
                    </div>

                    {/* BANNER */}
                    <div className="contenedor-subcategorias-imagen">
                    <a href="/tienda"
                      //to={`/categoria/${categoria.urlCategoria}`}
                      >
                        <img src={categoria.imagenBanner} alt="" />
                      </a>
                    </div>

                    {/* IMAGENES */}
                    <div className="contenedor-subcategorias-subimagenes">
                      {dataCategoria[index].galeriaImagenes.map((galeria) => (
                        <a href="/tienda"
                          key={galeria.idGaleriaImagen}
                          //to={`/categoria/${categoria.urlCategoria}`}
                        >
                          <img src={galeria.urlImagen} alt="" />
                        </a>
                      ))}
                    </div>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}            
