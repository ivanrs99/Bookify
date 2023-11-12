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
  return signInWithEmailAndPassword(auth, email, contraseña).catch((error) => {
    showLogInError(error);
  });
};

const showLogInError = (error) => {
  if (error.code === "auth/invalid-login-credentials") {
    showMessage({
      message: "Error de inicio de sesión",
      description: "La contraseña es incorrecta.",
      type: "danger",
    });
  } else if (error.code === "auth/too-many-requests") {
    showMessage({
      message: "Error de inicio de sesión",
      description:
        "Has fallado la contraseña demasiadas veces. Inténtalo más tarde o restablece la contraseña.",
      type: "danger",
    });
  } else {
    showMessage({
      message: "Error de inicio de sesión",
      description: "Ocurrió un error al iniciar sesión.",
      type: "danger",
    });
  }
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
  try {
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

    signIn(email, contraseña);
  } catch (error) {
    showSignUpError(error);
  }
};

const showSignUpError = (error) => {
  if (error.code === "auth/email-already-in-use") {
    showMessage({
      message: "Error de registro",
      description: "Email ya en uso.",
      type: "danger",
    });
  } else if (error.code === "auth/invalid-email") {
    showMessage({
      message: "Error de registro",
      description: "El email no tiene un formato correcto.",
      type: "danger",
    });
  } else {
    showMessage({
      message: "Error de registro",
      description: error.message,
      type: "danger",
    });
  }
};

// Buscar un usuario en específico
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
  uid,
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
      usuario: uid,
      puntuacion: puntuacion,
      descripcion: descripcion,
      fecha: fechaActual.toISOString(),
    });

    if (imagen) uploadImg(imagen, uid + fechaActual.toISOString(), "reseñas/");

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

export { signIn, findUser, signUp, signOutUser, addReview };
