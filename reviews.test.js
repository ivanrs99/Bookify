import { addReview } from "./database/firebaseFunctions";

const reviews_add_test = async (n) => {
  const startTime = Date.now();

  const promises = Array.from({ length: n }, (_, index) => {
    return addReview(
      "ramicel@gmail.com",
      "Roma soy yo",
      "Santiago Posteguillo",
      4,
      "Esto es una descripcion de prueba",
      null
    );
  });

  await Promise.all(promises);

  const endTime = Date.now();
  const elapsedTime = endTime - startTime;

  console.log(`Publicadas ${n} reseñas en ${elapsedTime} milisegundos`);
};

export { reviews_add_test };
