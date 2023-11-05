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
  return signInWithEmailAndPassword(auth, email, contraseña)
    .then(() => {
      console.log("conseguido!");
    })
    .catch((error) => {
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
    if (imagen) uploadImg(imagen, usuario);
    const usuariosRef = collection(db, "usuarios");
    await addDoc(usuariosRef, {
      usuario: usuario,
      email: email,
      nombre: nombre,
      apellidos: apellidos,
    });

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
const uploadImg = async (imagen, nombre) => {
  const response = await fetch(imagen);
  const blob = await response.blob();
  const storageRef = ref(storage, "perfil/" + nombre);
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

export { signIn, findUser, signUp, signOutUser };
