import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDb8SkW1JVTn75esaj6lyVtyvAr0WqMPn4",
  authDomain: "billede-c85f3.firebaseapp.com",
  projectId: "billede-c85f3",
  storageBucket: "billede-c85f3.appspot.com",
  messagingSenderId: "278386302097",
  appId: "1:278386302097:web:46ea78e9432ba293c83330",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const uploadImage = async (image) => {
  const imageRef = ref(`images/${image.name}`);
  await imageRef.put(image).catch((error) => {
    throw error;
  });
  const url = await imageRef.getDownloadURL().catch((error) => {
    throw error;
  });
  return url;
};

export { uploadImage };
