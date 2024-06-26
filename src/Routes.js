import React from "react";
import { Switch , Redirect } from "react-router-dom";
import {
  RutaPublica,
  RutaCliente,
  RutaSemiPrivada,
  RutaAdministrador,
} from "./router";
import {
  LayoutGeneral,
  LayoutCliente,
  LayoutAdministracion,
} from "./layout/conLayout";
import SinLayout from "./layout/sinLayout/SinLayout";

import {
  Pagina404,
  GeneralInicio,
  GeneralRegistrar,
  GeneralIngresar,
  GeneralTienda,
  GeneralGraciasPorRegistrarte,
  GeneralRecuperarContrasena,
  GeneralVerificar,
  GeneralIngresarAdministrador,
  GeneralProducto,
  ClientePerfil,
  ClienteDirecciones,
  ClienteCompras,
  ClienteConfirmacion,
  ClienteFavoritos,
  ClienteGuardados,
  ClientePersonalizar,
  GeneralCheckout,
  AdmnistradorReportes,
  AdmnistradorCategorias,
  AdmnistradorCategoriasCrear,
  AdmnistradorCategoriasEditar,
  AdmnistradorEtiquetas,
  AdmnistradorProductos,
  AdmnistradorProductosCrear,
  AdmnistradorProductosEditar,
  AdmnistradorPersonales,
  AdmnistradorPedidos,
  AdmnistradorClientes,
} from "./pages";

const Routes = () => {
  return (
    <Switch >
      {/* RUTAS PUBLICAS*/}
      <RutaPublica
        component={GeneralInicio}
        exact
        layout={LayoutGeneral}
        path="/"
      />
      <RutaPublica
        component={GeneralCheckout}
        exact
        layout={LayoutGeneral}
        path="/checkout"
      />
      <RutaPublica
        component={GeneralTienda}
        exact
        layout={LayoutGeneral}
        path="/tienda"
      />
      <RutaPublica
        component={GeneralProducto}
        exact
        layout={LayoutGeneral}
        path="/producto/:producto/:id"
      />
      <RutaSemiPrivada
        component={GeneralRegistrar}
        exact
        layout={LayoutGeneral}
        path="/registrar"
      />
      <RutaSemiPrivada
        component={GeneralIngresar}
        exact
        layout={LayoutGeneral}
        path="/ingresar"
      />
      <RutaSemiPrivada
        component={GeneralGraciasPorRegistrarte}
        exact
        layout={LayoutGeneral}
        path="/gracias-por-registrarte"
      />

      <RutaSemiPrivada
        component={GeneralRecuperarContrasena}
        exact
        layout={LayoutGeneral}
        path="/recuperar-contrasena"
      />
      <RutaSemiPrivada
        component={GeneralVerificar}
        exact
        layout={LayoutGeneral}
        path="/verificar"
      />
      <RutaSemiPrivada
        component={GeneralIngresarAdministrador}
        exact
        layout={LayoutGeneral}
        path="/ingresar/administrador"
      />      
      {/* RUTAS CLIENTE*/}
      <RutaCliente
        component={ClientePerfil}
        exact
        layout={LayoutCliente}
        path="/cliente/perfil"
      />
      <RutaCliente
        component={ClienteDirecciones}
        exact
        layout={LayoutCliente}
        path="/cliente/direcciones"
      />
      <RutaCliente
        component={ClienteCompras}
        exact
        layout={LayoutCliente}
        path="/cliente/mis-compras"
      />
      <RutaCliente
        component={ClienteConfirmacion}
        exact
        layout={LayoutCliente}
        path="/cliente/confirmacion"
      />
      <RutaCliente
        component={ClienteFavoritos}
        exact
        layout={LayoutCliente}
        path="/cliente/favoritos"
      />
      <RutaCliente
        component={ClienteGuardados}
        exact
        layout={LayoutCliente}
        path="/cliente/guardados"
      />
      <RutaCliente
        component={ClientePersonalizar}
        exact
        layout={LayoutCliente}
        path="/cliente/personalizar"
      />
      {/* RUTAS ADMINISTRADOR*/}
      <RutaAdministrador
        component={AdmnistradorReportes}
        exact
        layout={LayoutAdministracion}
        path="/administrador/reportes"
      />
      <RutaAdministrador
        component={AdmnistradorCategorias}
        exact
        layout={LayoutAdministracion}
        path="/administrador/categorias"
      />
      <RutaAdministrador
        component={AdmnistradorCategoriasCrear}
        exact
        layout={LayoutAdministracion}
        path="/administrador/categoria-crear"
      />
      <RutaAdministrador
        component={AdmnistradorCategoriasEditar}
        exact
        layout={LayoutAdministracion}
        path="/administrador/categoria-editar/:id"
      />
      <RutaAdministrador
        component={AdmnistradorEtiquetas}
        exact
        layout={LayoutAdministracion}
        path="/administrador/modelos"
      />
      <RutaAdministrador
        component={AdmnistradorProductos}
        exact
        layout={LayoutAdministracion}
        path="/administrador/productos"
      />
      <RutaAdministrador
        component={AdmnistradorProductosCrear}
        exact
        layout={LayoutAdministracion}
        path="/administrador/producto-crear"
      />
      <RutaAdministrador
        component={AdmnistradorProductosEditar}
        exact
        layout={LayoutAdministracion}
        path="/administrador/producto-editar/:id"
      />
      <RutaAdministrador
        component={AdmnistradorPersonales}
        exact
        layout={LayoutAdministracion}
        path="/administrador/personales"
      />
      <RutaAdministrador
        component={AdmnistradorPedidos}
        exact
        layout={LayoutAdministracion}
        path="/administrador/pedidos"
      />
      <RutaAdministrador
        component={AdmnistradorClientes}
        exact
        layout={LayoutAdministracion}
        path="/administrador/clientes"
      />
      {/* RUTAS NO ENCONTRADAS*/}
      {/* <RutaPublica
        component={Pagina404}
        exact
        layout={SinLayout}
        path="/pagina-no-encontrada"
      />
      <Redirect to="/pagina-no-encontrada" /> */}
    </Switch >
  );
};

export default Routes;
