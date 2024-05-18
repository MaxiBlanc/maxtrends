import { eventosClick } from "../controllers/Analytics";

export default function EnviarWhatsAppCarrito(products, total) {
  eventosClick(total);
  const numeroCelular = "3447465234";
  let saltoLinea = "%0D%0A";
  var descripcionProductos = products.map(function (des) {
    return (
      "- " +
      des.Unidades +
      " unidad(es) de " +
      des.Nombre +
      " a S/. " +
      des.Precio +
      ".00" +
      saltoLinea
    );
  });
  const textoMensaje = `Hola, necesito ayuda con mi compra `;
  const wspLink = `https://api.whatsapp.com/send/?phone=54${numeroCelular}&text=${textoMensaje}&app_absent=0`;
  window.open(wspLink, "_blank");
}
