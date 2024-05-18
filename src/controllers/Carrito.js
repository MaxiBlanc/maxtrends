import {
  collection,
    doc,
    deleteDoc,
    addDoc,
    updateDoc,
    getDocs,
    setDoc,
    getDoc
  } from "firebase/firestore";
  import { db } from "../db/firebase";
  const coleccion = "Clientes";
  const subColeccion = "Carrito";
  
  export const favoritosTodos = async (idUsuario) => {
    const carritoRef = collection(db, coleccion, idUsuario, subColeccion);
    const carritoDB = await getDocs(carritoRef);
    return carritoDB.docs.map((doc) => {
      const id = doc.id;
      return {
        IdCarrito: id,
        ...doc.data(),
      };
    });
  };
  
  export const carritoCrear = async (idUsuario, producto) => {
    const carritoRef = collection(db, coleccion, idUsuario, subColeccion);
    try {
      await addDoc(carritoRef, {
        Nombre: producto.nombre,
      });
    } catch (e) {
      console.error("No se pudo agregar carrito ", e);
    }
  };
  
  export const favoritoEditar = async (idUsuario, favorito) => {
    const rrutaCarrito = `${coleccion}/${idUsuario}/${subColeccion}`;
    const carritoRef = doc(db, rrutaCarrito, favorito.idCarrito);
    await updateDoc(carritoRef, {
      Nombre: favorito.nombre,
    });
  };
  
  export const favoritoEliminar = async (idUsuario, idCarrito) => {
    const rrutaCarrito = `${coleccion}/${idUsuario}/${subColeccion}`;
    const carritoRef = doc(db, rrutaCarrito, idCarrito);
    await deleteDoc(carritoRef);
  };


  export const agregarPedido = async (total, usuario, productos, direccion, numeroPedido) => {
    try {
      // Referencia a la colección "Carrito" dentro de la colección del cliente
      const carritoRef = collection(db, "Pedido");
  
      // Agregar la compra al carrito
      await addDoc(carritoRef, {
        Total: total,
        Productos: productos,
        Direccion: direccion,
        Fecha: new Date(),
        IdCliente: usuario.IdCliente,
        Nombres: usuario.Nombres,
        Apellidos: usuario.Apellidos,
        Correo: usuario.Correo,
        Celular: usuario.Celular,
        Estado: "pedido",
        NumeroPedido: numeroPedido,
      });
  
      console.log("Compra agregada al carrito en Firestore correctamente.");
    } catch (error) {
      console.error("Error al agregar compra al carrito en Firestore:", error);
    }
  };
  
  export const agregarCarrito = async (total, usuario, productos, direccion, numeroPedido) => {
    try {
      // Referencia a la colección "Carrito" dentro de la colección del cliente
      const carritoRef = collection(db, coleccion, usuario.IdCliente, subColeccion);
  
      // Agregar la compra al carrito
      await addDoc(carritoRef, {
        Total: total,
        Productos: productos,
        Direccion: direccion,
        Fecha: new Date(),
        IdCliente: usuario.IdCliente,
        Nombres: usuario.Nombres,
        Apellidos: usuario.Apellidos,
        Correo: usuario.Correo,
        Celular: usuario.Celular,
        Estado: "pedido",
        NumeroPedido: numeroPedido,
      });
  
      console.log("Compra agregada al carrito en Firestore correctamente.");
    } catch (error) {
      console.error("Error al agregar compra al carrito en Firestore:", error);
    }
  };
  

  
  
  export const carritoTraerUno = async (IdCliente) => {
    const rrutaCarrito = `${coleccion}/${IdCliente}/${subColeccion}`;
    const carritoRef = doc(db, rrutaCarrito, IdCliente);
    const carritoDB = await getDoc(carritoRef);
    if (carritoDB.exists()) {
      return carritoDB.data();
    } else {
      console.log("No existe el documento");
      console.log(rrutaCarrito)
      console.log(`${coleccion}/${IdCliente}/${subColeccion}`)
    }
  };