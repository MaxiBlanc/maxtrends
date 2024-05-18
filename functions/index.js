const functions = require("firebase-functions");
var admin = require("firebase-admin");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const axios = require("axios");
const cors = require("cors")({
  origin: [
    "http://localhost:4000",
    "http://localhost:3001",
  ],
  methods: ["POST"],
  credentials: true,
});

const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token:
    "TEST-8254751652872271-062815-bd2f53c8362955b9d8a3d92771a7ede0-1150858745",
});
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://ecommerce-logan-ee1e8.firebaseio.com/", //https://ecommerce-logan-ee1e8.firebaseapp.com/
});
const db = admin.firestore();

exports.crearIdMP = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const listItems = req.body;
    var productosEnviar = listItems.map((item) => {
      return {
        title: item.nombre,
        unit_price: parseFloat(item.precio),
        quantity: item.cantidad,
      };
    }); 

    let preference = {
      items: productosEnviar,
      back_urls: {
        success: "http://localhost:3001/cliente/confirmacion",
        failure: "http://localhost:3001/",
        pending: "http://localhost:3001/",
      },
      auto_return: "approved",
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.set("Access-Control-Allow-Origin", "http://localhost:3001");
        res.set("Access-Control-Allow-Methods", "POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.set("Access-Control-Max-Age", "3600");
        res.set("Access-Control-Allow-Credentials", true);
        //console.log("response: ", response);
        return res.status(200).send({
          id: response.body.id,
          url: response.body.init_point,
          urlSandbox: response.body.sandbox_init_point,
        });
      })
      .catch(function (error) {
        console.log("error: ", error);
        return res.status(500).send(error);
      });
  });
});

exports.creaPagoMP = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let payment_idFront = req.body.payment_id;
    let statusFront = req.body.status;
    axios
      .get(
        `https://api.mercadopago.com/v1/payments/${payment_idFront}?access_token=TEST-8254751652872271-062815-bd2f53c8362955b9d8a3d92771a7ede0-1150858745`
      )
      .then(function (response) {
        if (
          payment_idFront === response.data.id.toString() &&
          statusFront === response.data.status
        ) {
          const coleccion = "Clientes";
          const subColeccion = "Pedidos";
          const carritoDB = req.body.carritoDB;
          //console.log("carritoDB: ", carritoDB)
          const numeroPedido = "00" + Date.now();
          return db
            .collection(coleccion)
            .doc(carritoDB.IdCliente)
            .collection(subColeccion)
            .doc(numeroPedido)
            .set({
              Total: carritoDB.Total,
              Productos: carritoDB.Productos,
              Direccion: carritoDB.Direccion,
              Fecha: new Date(),
              IdCliente: carritoDB.IdCliente,
              Nombres: carritoDB.Nombres,
              Apellidos: carritoDB.Apellidos,
              Correo: carritoDB.Correo,
              Celular: carritoDB.Celular,
              Estado: "pedido",
              NumeroPedido: numeroPedido,
            })
            .then(() => {
              return db
                .collection(coleccion)
                .doc(carritoDB.IdCliente)
                .collection("Carrito")
                .doc(carritoDB.IdCliente)
                .delete()
                .then(() => {
                  res.set(
                    "Access-Control-Allow-Origin",
                    "http://localhost:3001"
                  );
                  res.set("Access-Control-Allow-Methods", "POST");
                  res.set("Access-Control-Allow-Headers", "Content-Type");
                  res.set("Access-Control-Max-Age", "3600");
                  res.set("Access-Control-Allow-Credentials", true);
                  return res.status(200).send({
                    data: true,
                  });
                })
                .catch((err) => {
                  console.log("error", err);
                  return res.status(500).send(err);
                });
            })
            .catch((err) => {
              console.log("error", err);
              return res.status(500).send(err);
            });
        } else {
          console.log("no son iguales");
          return res.status(500).send("Los IDs de pago y el estado no coinciden");
        }
      })
      .catch(function (error) {
        console.log("error", error);
        return res.status(500).send(error);
      });
  });
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function welcome(agent) {
      agent.add(`Hola como estas????`);
      const payload = {
        richContent: [
          [
          ],
        ],
      };
      agent.add(
        new Payload(agent.UNSPECIFIED, payload, {
          rawPayload: true,
          sendAsMessage: true,
        })
      );
    }
    

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});