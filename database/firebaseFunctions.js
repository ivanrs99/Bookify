import { showMessage } from "react-native-flash-message";
import { auth, db, storage } from "../database/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  where,
  limit,
  getDocs,
  query,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Iniciar sesión
const signIn = async (email, contraseña) => {
  return signInWithEmailAndPassword(auth, email, contraseña);
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

// Obtener imagen
const getImg = async (ruta, nombre) => {
  const imgRef = ref(storage, ruta + nombre);
  try {
    const url = await getDownloadURL(imgRef);
    return url;
  } catch (error) {
    return null;
  }
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
    let url = "";
    if (imagen) {
      await uploadImg(imagen, email + fechaActual.toISOString(), "reseñas/");
      url = await getImg("reseñas/", email + fechaActual.toISOString());
    }

    const reseñasRef = collection(db, "reseñas");
    await addDoc(reseñasRef, {
      libro: book.id,
      usuario: email,
      puntuacion: puntuacion,
      descripcion: descripcion,
      fecha: fechaActual.toISOString(),
      url_img: url,
    });

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
    console.log(error);
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

const findBookById = async (id) => {
  const q = doc(db, "libros", id);

  try {
    const docSnapshot = await getDoc(q);
    if (!docSnapshot.empty) {
      return docSnapshot.data();
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
    return [];
  }
};

// Encontrar seguidores
const findSeguidores = async (email) => {
  const q = query(collection(db, "seguidos"), where("seguido", "==", email));
  const queryResult = await getDocs(q);
  const seguidores = [];

  queryResult.forEach((doc) => {
    seguidores.push(doc.data().seguidor);
  });

  if (queryResult.size > 0) {
    return seguidores;
  } else {
    return [];
  }
};

// Encontrar reseñas de una lista de usuarios
const getReseñasFromUsers = async (users) => {
  const reseñas = [];

  for (const user of users) {
    const q = query(collection(db, "reseñas"), where("usuario", "==", user));
    const queryResult = await getDocs(q);

    queryResult.forEach((doc) => {
      const reviewId = doc.id;
      const reviewData = doc.data();
      reseñas.push({ id: reviewId, ...reviewData });
    });
  }

  const reseñasOrdenadas = reseñas.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return reseñasOrdenadas;
};

// Encontrar reseñas de un usuario
const getReseñasFromUser = async (user) => {
  const reseñas = [];

  const q = query(collection(db, "reseñas"), where("usuario", "==", user));
  const queryResult = await getDocs(q);

  queryResult.forEach((doc) => {
    const reviewId = doc.id;
    const reviewData = doc.data();
    reseñas.push({ id: reviewId, ...reviewData });
  });

  const reseñasOrdenadas = reseñas.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return reseñasOrdenadas;
};

// Añadir like
const likeReview = async (user_email, review_id) => {
  try {
    const likesRef = collection(db, "likes");
    await addDoc(likesRef, {
      user: user_email,
      review: review_id,
    });
  } catch (error) {
    console.log(error);
  }
};

// Borrar like
const removelikeReview = async (user_email, review_id) => {
  try {
    const q = query(
      collection(db, "likes"),
      where("user", "==", user_email),
      where("review", "==", review_id),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(likeDoc.ref);
    }
  } catch (error) {
    console.log(error);
  }
};

// Obtener likes totales
const getTotalLikes = async (review_id) => {
  const totalLikesQuery = query(
    collection(db, "likes"),
    where("review", "==", review_id)
  );

  const totalLikesSnapshot = await getDocs(totalLikesQuery);
  return totalLikesSnapshot.size;
};

// Para saber si el usuario le ha dado like
const isLiked = async (user_email, review_id) => {
  const q = query(
    collection(db, "likes"),
    where("user", "==", user_email),
    where("review", "==", review_id)
  );

  const result = await getDocs(q);
  return !result.empty;
};

export {
  signIn,
  findUser,
  signUp,
  signOutUser,
  addReview,
  findSeguidos,
  getReseñasFromUsers,
  getReseñasFromUser,
  findUserByEmail,
  getImg,
  findBookById,
  likeReview,
  removelikeReview,
  getTotalLikes,
  isLiked,
  findSeguidores,
};
