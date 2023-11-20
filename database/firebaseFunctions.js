import { showMessage } from "react-native-flash-message";
import { auth, db, storage } from "../database/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import {
  collection,
  where,
  limit,
  getDocs,
  query,
  addDoc,
} from "firebase/firestore";

// Iniciar sesión
const signIn = async (email, contraseña) => {
  return signInWithEmailAndPassword(auth, email, contraseña);
};

// Registrar usuario
const signUp = async (
  email,
  contraseña,
  usuario,
  nombre,
  apellidos,
  imagen
) => {
  await createUserWithEmailAndPassword(auth, email, contraseña);
  const usuariosRef = collection(db, "usuarios");
  await addDoc(usuariosRef, {
    usuario: usuario,
    email: email,
    nombre: nombre,
    apellidos: apellidos,
  });
  if (imagen) uploadImg(imagen, usuario, "perfil/");

  showMessage({
    message: "Bienvenido!",
    description: "Usuario registrado con éxito.",
    type: "success",
  });
};

// Buscar un usuario por nombre de usuario
const findUser = async (usuario) => {
  const q = query(
    collection(db, "usuarios"),
    where("usuario", "==", usuario),
    limit(1)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
  }
};

// Buscar usuario desde un email
const findUserByEmail = async (email) => {
  const q = query(
    collection(db, "usuarios"),
    where("email", "==", email),
    limit(1)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
  }
};

// Subir imagen
const uploadImg = async (imagen, nombre, ruta) => {
  const response = await fetch(imagen);
  const blob = await response.blob();
  const storageRef = ref(storage, ruta + nombre);
  await uploadBytes(storageRef, blob);
};

// Cerrar sesión
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("Sesión cerrada.");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Publicar reseña
const addReview = async (
  email,
  titulo,
  autor,
  puntuacion,
  descripcion,
  imagen
) => {
  try {
    let book = await findBook(titulo, autor);
    if (book == null) {
      await createBook(titulo, autor);
      book = await findBook(titulo, autor);
    }

    const fechaActual = new Date();
    const reseñasRef = collection(db, "reseñas");
    await addDoc(reseñasRef, {
      libro: book.id,
      usuario: email,
      puntuacion: puntuacion,
      descripcion: descripcion,
      fecha: fechaActual.toISOString(),
    });

    if (imagen)
      uploadImg(imagen, email + fechaActual.toISOString(), "reseñas/");

    showMessage({
      message: "Reseña publicada con éxito",
      type: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

// Crear libro
const createBook = async (titulo, autor) => {
  try {
    const librosRef = collection(db, "libros");
    await addDoc(librosRef, {
      titulo: titulo,
      autor: autor,
    });
  } catch (error) {
    Console.log(error);
  }
};

// Encontrar libro
const findBook = async (titulo, autor) => {
  const q = query(
    collection(db, "libros"),
    where("autor", "==", autor),
    where("titulo", "==", titulo),
    limit(1)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar el libro:", error);
  }
};

// Encontrar seguidos
const findSeguidos = async (email) => {
  const q = query(collection(db, "seguidos"), where("seguidor", "==", email));
  const queryResult = await getDocs(q);
  const seguidos = [];

  queryResult.forEach((doc) => {
    seguidos.push(doc.data().seguido);
  });

  if (queryResult.size > 0) {
    return seguidos;
  } else {
    return null;
  }
};

// Encontrar reseñas seguidos
const getReseñasSeguidos = async (seguidos) => {
  const reseñas = [];

  for (const seguido of seguidos) {
    const q = query(collection(db, "reseñas"), where("usuario", "==", seguido));
    const queryResult = await getDocs(q);

    queryResult.forEach((doc) => {
      reseñas.push(doc.data());
    });
  }

  const reseñasOrdenadas = reseñas.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return reseñasOrdenadas;
};

export {
  signIn,
  findUser,
  signUp,
  signOutUser,
  addReview,
  findSeguidos,
  getReseñasSeguidos,
  findUserByEmail,
};
