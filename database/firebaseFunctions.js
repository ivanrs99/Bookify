import { showMessage } from "react-native-flash-message";
import { auth, db, storage } from "../database/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
  updateDoc,
  collectionGroup,
} from "firebase/firestore";

// Iniciar sesión
const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
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
const signUp = async (email, password, user, name, surname, image) => {
  await createUserWithEmailAndPassword(auth, email, password);
  const usuariosRef = collection(db, "usuarios");
  await addDoc(usuariosRef, {
    usuario: user,
    email: email,
    nombre: name,
    apellidos: surname,
  });
  if (image) uploadImg(image, user, "perfil/");

  showMessage({
    message: "Bienvenido!",
    description: "Usuario registrado con éxito.",
    type: "success",
  });
};

// Editar datos de usuario
const editUser = async (name, surname, user, img) => {
  if (img) uploadImg(img, user, "perfil/");
  else {
    removeImg("perfil/", user);
  }

  const userQuery = query(
    collection(db, "usuarios"),
    where("usuario", "==", user)
  );
  const result = await getDocs(userQuery);
  if (!result.empty) {
    const userDoc = result.docs[0].ref;
    await updateDoc(userDoc, {
      nombre: name,
      apellidos: surname,
    });
  }
};

// Buscar un usuario por nombre de usuario
const findUser = async (user) => {
  const userQuery = query(
    collection(db, "usuarios"),
    where("usuario", "==", user),
    limit(1)
  );

  const result = await getDocs(userQuery);
  if (!result.empty) {
    return result.docs[0].data();
  } else {
    return null;
  }
};

// Buscar usuario desde un email
const findUserByEmail = async (email) => {
  const userQuery = query(
    collection(db, "usuarios"),
    where("email", "==", email),
    limit(1)
  );

  const result = await getDocs(userQuery);
  if (!result.empty) {
    return result.docs[0].data();
  } else {
    return null;
  }
};

// Buscar usuarios donde el nombre de usuario contenga el parámetro
const findUserByParamContaining = async (param) => {
  const users = [];
  const usersQuery = query(
    collection(db, "usuarios"),
    where("usuario", ">=", param),
    limit(10)
  );

  const result = await getDocs(usersQuery);
  result.forEach((doc) => {
    users.push(doc.data());
  });

  return users;
};

// Subir imagen
const uploadImg = async (image, name, route) => {
  const response = await fetch(image);
  const blob = await response.blob();
  const storageRef = ref(storage, route + name);
  await uploadBytes(storageRef, blob);
};

// Obtener imagen
const getImg = async (route, name) => {
  const imgRef = ref(storage, route + name);
  try {
    const url = await getDownloadURL(imgRef);
    return url;
  } catch (error) {
    return null;
  }
};

// Borrar imagen
const removeImg = async (route, name) => {
  const imgRef = ref(storage, route + name);

  deleteObject(imgRef)
    .then(() => {
      console.log("img removed");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Publicar reseña
const addReview = async (email, title, author, score, description, image) => {
  let book = await findBook(title, author);
  if (book == null) {
    await createBook(title, author);
    book = await findBook(title, author);
  }

  const actualDate = new Date();
  let url = "";
  if (image) {
    await uploadImg(image, email + actualDate.toISOString(), "reseñas/");
    url = await getImg("reseñas/", email + actualDate.toISOString());
  }

  const reseñasRef = collection(db, "reseñas");
  await addDoc(reseñasRef, {
    libro: book.id,
    usuario: email,
    puntuacion: score,
    descripcion: description,
    fecha: actualDate.toISOString(),
    url_img: url,
  });

  showMessage({
    message: "Reseña publicada con éxito",
    type: "success",
  });
};

// Borrar review
const deleteReview = async (id) => {
  const reviewDoc = doc(db, "reseñas", id);
  await deleteDoc(reviewDoc);

  const likesQuery = query(collection(db, "likes"), where("review", "==", id));

  const likesList = await getDocs(likesQuery);
  for (const like of likesList.docs) {
    await deleteDoc(like.ref);
  }
};

// Crear libro
const createBook = async (title, author) => {
  const librosRef = collection(db, "libros");
  await addDoc(librosRef, {
    titulo: title,
    autor: author,
  });
};

// Encontrar libro
const findBook = async (title, author) => {
  const bookQuery = query(
    collection(db, "libros"),
    where("autor", "==", author),
    where("titulo", "==", title),
    limit(1)
  );

  const result = await getDocs(bookQuery);
  if (!result.empty) {
    return result.docs[0];
  } else {
    return null;
  }
};

const findBookById = async (id) => {
  const bookQuery = doc(db, "libros", id);
  const result = await getDoc(bookQuery);
  if (!result.empty) {
    return result.data();
  } else {
    return null;
  }
};

// Encontrar seguidos
const findSeguidos = async (email) => {
  const followsQuery = query(
    collection(db, "seguidos"),
    where("seguidor", "==", email)
  );
  const result = await getDocs(followsQuery);
  const seguidos = [];

  result.forEach((doc) => {
    seguidos.push(doc.data().seguido);
  });

  if (result.size > 0) {
    return seguidos;
  } else {
    return [];
  }
};

// Encontrar seguidores
const findSeguidores = async (email) => {
  const followsQuery = query(
    collection(db, "seguidos"),
    where("seguido", "==", email)
  );
  const result = await getDocs(followsQuery);
  const seguidores = [];

  result.forEach((doc) => {
    seguidores.push(doc.data().seguidor);
  });

  if (result.size > 0) {
    return seguidores;
  } else {
    return [];
  }
};

// Comprobar si un usuario sigue a otro
const isFollowed = async (my_email, user_email) => {
  const followQuery = query(
    collection(db, "seguidos"),
    where("seguidor", "==", my_email),
    where("seguido", "==", user_email),
    limit(1)
  );

  const result = await getDocs(followQuery);
  return !result.empty;
};

// Seguir a un usuario
const follow = async (my_email, user_email) => {
  const followsRef = collection(db, "seguidos");
  await addDoc(followsRef, {
    seguidor: my_email,
    seguido: user_email,
  });
};

// Dejar de seguir a un usuario
const unfollow = async (my_email, user_email) => {
  const followQuery = query(
    collection(db, "seguidos"),
    where("seguidor", "==", my_email),
    where("seguido", "==", user_email),
    limit(1)
  );

  const result = await getDocs(followQuery);
  if (!result.empty) {
    const doc = result.docs[0];
    await deleteDoc(doc.ref);
  }
};

// Encontrar reseñas de una lista de usuarios
const getReseñasFromUsers = async (users) => {
  const reviews = [];
  for (const user of users) {
    const reviewsQuery = query(
      collection(db, "reseñas"),
      where("usuario", "==", user)
    );

    const result = await getDocs(reviewsQuery);
    result.forEach((doc) => {
      const reviewId = doc.id;
      const reviewData = doc.data();
      reviews.push({ id: reviewId, ...reviewData });
    });
  }

  const reviewsSorted = reviews.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return reviewsSorted;
};

// Encontrar reseñas de un usuario
const getReseñasFromUser = async (user) => {
  const reviews = [];
  const reviewsQuery = query(
    collection(db, "reseñas"),
    where("usuario", "==", user)
  );

  const result = await getDocs(reviewsQuery);
  result.forEach((doc) => {
    const reviewId = doc.id;
    const reviewData = doc.data();
    reviews.push({ id: reviewId, ...reviewData });
  });

  const reviewsSorted = reviews.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return reviewsSorted;
};

// Añadir like
const likeReview = async (user_email, review_id) => {
  const likesRef = collection(db, "likes");
  await addDoc(likesRef, {
    user: user_email,
    review: review_id,
  });
};

// Borrar like
const removelikeReview = async (user_email, review_id) => {
  const likeQuery = query(
    collection(db, "likes"),
    where("user", "==", user_email),
    where("review", "==", review_id),
    limit(1)
  );

  const result = await getDocs(likeQuery);
  if (!result.empty) {
    const likeDoc = result.docs[0];
    await deleteDoc(likeDoc.ref);
  }
};

// Obtener likes totales
const getTotalLikes = async (review_id) => {
  const totalLikesQuery = query(
    collection(db, "likes"),
    where("review", "==", review_id)
  );

  const result = await getDocs(totalLikesQuery);
  return result.size;
};

// Para saber si el usuario le ha dado like
const isLiked = async (user_email, review_id) => {
  const likeQuery = query(
    collection(db, "likes"),
    where("user", "==", user_email),
    where("review", "==", review_id)
  );

  const result = await getDocs(likeQuery);
  return !result.empty;
};

// BORRAR CUENTA
const deleteUserData = async (email) => {
  deleteReviews(email);
  deleteFollowers(email);
  deleteFollowings(email);
  deleteLikes(email);

  const userQuery = query(
    collection(db, "usuarios"),
    where("email", "==", email)
  );
  const result = await getDocs(userQuery);
  const deletePromises = result.docs.map(async (doc) => {
    const data = doc.data();
    removeImg("perfil/", data.usuario);
    await deleteDoc(doc.ref);
  });

  await Promise.all(deletePromises);
};

const deleteReviews = async (email) => {
  const reviewsQuery = query(
    collection(db, "reseñas"),
    where("usuario", "==", email)
  );

  const result = await getDocs(reviewsQuery);
  const deletePromises = result.docs.map(async (doc) => {
    const data = doc.data();
    if (data.url_img != "") {
      removeImg("reseñas/", data.usuario + data.fecha);
    }
    await deleteDoc(doc.ref);
  });

  await Promise.all(deletePromises);
};

const deleteFollowers = async (email) => {
  const followersQuery = query(
    collection(db, "seguidos"),
    where("seguido", "==", email)
  );
  const result = await getDocs(followersQuery);
  const deletePromises = result.docs.map(async (doc) => {
    await deleteDoc(doc.ref);
  });

  await Promise.all(deletePromises);
};

const deleteFollowings = async (email) => {
  const followingQuery = query(
    collection(db, "seguidos"),
    where("seguidor", "==", email)
  );
  const result = await getDocs(followingQuery);
  const deletePromises = result.docs.map(async (doc) => {
    await deleteDoc(doc.ref);
  });

  await Promise.all(deletePromises);
};

const deleteLikes = async (email) => {
  const likesQuery = query(collection(db, "likes"), where("user", "==", email));
  const result = await getDocs(likesQuery);
  const deletePromises = result.docs.map(async (doc) => {
    await deleteDoc(doc.ref);
  });

  await Promise.all(deletePromises);
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
  editUser,
  deleteReview,
  findUserByParamContaining,
  isFollowed,
  follow,
  unfollow,
  deleteUserData,
};
