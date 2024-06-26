import React, {  useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { EstadoContexto } from "../context/EstadoGeneral";
const RutaPrivada = (props) => {
  const { layout: Layout, component: Component, location, ...rest } = props;
  const { usuario } = useContext(EstadoContexto);
  const exiteUsuario = Object.keys(usuario).length 

  const handleNavigateToCheckout = () => {
    window.location.href = "/ingresar";
  }

  return exiteUsuario  && usuario.Rol === "administrador" ? (
    <Route
      {...rest}
      render={(matchProps) => <Layout>{<Component {...matchProps} />}</Layout>}
    />
  ) : (
    <div onClick={handleNavigateToCheckout}></div>
  );
};

RutaPrivada.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
};

export default RutaPrivada;
