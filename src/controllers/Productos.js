import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../db/firebase";
const coleccion = "Productos";
const rutaFoto = "productos-imagenes";

/* CREAR UNA CATEGORIA SIN IMAGEN */
export const productoCrearSF = async (
  formProducto,
  categoriaSelect,
  etiquetaFinal,
  fotosSubir
) => {
  try {
    await addDoc(collection(db, coleccion), {
      Nombre: formProducto.nombre,
      Marca: formProducto.marca,
      UrlProducto: formProducto.urlProducto,
      Descripcion: formProducto.descripcion,
      Precio: formProducto.precio,
      Cantidad: formProducto.cantidad,
      TiempoEntrega: formProducto.tiempoEntrega,
      Categoria: categoriaSelect,
      Etiqueta: etiquetaFinal,
      ImagenesUrl: fotosSubir,
    });
  } catch (e) {
    console.error("Error al agregar producto ", e);
  }
};

/* SUBIR UNA IMAGEN*/
export const productoCrearCF = (
  formProducto,
  categoriaSelect,
  etiquetaFinal,
  fotosVista
) => {
  const promises = fotosVista.map((file) => {
    const fechaAhora = Date.now();
    const rutaCompleta = file.name + fechaAhora + file.lastModified + file.size;
    const storage = getStorage();
    const imageRef = ref(storage, `${rutaFoto}/${rutaCompleta}`);
    return uploadBytes(imageRef, file)
      .then((snapshot) => {
        console.log("Imagen subida correctamente:", snapshot.ref);
        return getDownloadURL(snapshot.ref);
      })
      .catch((error) => {
        console.error("Error al subir imagen:", error);
        throw error; // Propaga el error para que Promise.all lo maneje
      });
  });

  return Promise.all(promises)
    .then((linkImagenes) => {
      console.log("Todas las imágenes se han subido correctamente:", linkImagenes);
      // Llamar a productoCrearSF con los datos obtenidos
      return productoCrearSF(
        formProducto,
        categoriaSelect,
        etiquetaFinal,
        linkImagenes
      );
    })
    .catch((error) => {
      console.error("Error al subir una o más imágenes:", error);
      // Puedes manejar el error aquí o propagarlo más arriba según sea necesario
      throw error;
    });
};


/* ELIMINAR UNA PRODUCTO */
export const productoEliminar = async (idProducto) => {
  await deleteDoc(doc(db, coleccion, idProducto));
};

export const productoUno = async (idProducto) => {
  const productoRef = doc(db, coleccion, idProducto);
  const docProducto = await getDoc(productoRef);
  if (docProducto.exists()) {
    return docProducto.data();
  } else {
    console.log("No existe el documento");
  }
};

/* EDITAR UNA CATEGORIA SIN IMAGEN */
export const productoEditarSF = async (
  formProducto,
  categoriaSelect,
  etiquetaFinal,
  fotosAntiguas
) => {
  const categoriaRef = doc(db, coleccion, formProducto.idProducto);
  await updateDoc(categoriaRef, {
    Nombre: formProducto.nombre,
    Marca: formProducto.marca,
    UrlProducto: formProducto.urlProducto,
    Descripcion: formProducto.descripcion,
    Precio: formProducto.precio,
    Cantidad: formProducto.cantidad,
    TiempoEntrega: formProducto.tiempoEntrega,
    Categoria: categoriaSelect,
    Etiqueta: etiquetaFinal,
    ImagenesUrl: fotosAntiguas,
  });
};

// EDITAR PRODUCTO CON FOTO //
export const productoEditarCF = (
  formProducto,
  categoriaSelect,
  etiquetaFinal,
  fotosAntiguas,
  fotosVista
) => {
  const promises = fotosVista.map((file) => {
    const fechaAhora = Date.now();
    const rutaCompleta = file.name + fechaAhora + file.lastModified + file.size;
    const storage = getStorage();
    const imageRef = ref(storage, `${rutaFoto}/${rutaCompleta}`);
    return uploadBytes(imageRef, file)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .catch((error) => {
        console.error("Error al subir imagenes", error);
      });
  });
  Promise.all(promises)
    .then((linkImagenes) => {
      const fotosSubir =
        fotosAntiguas.length === 0
          ? linkImagenes
          : fotosAntiguas.concat(linkImagenes);

      productoEditarSF(
        formProducto,
        categoriaSelect,
        etiquetaFinal,
        fotosSubir
      );
    })
    .catch(() => {
      return "Hubo un error";
    });
};
