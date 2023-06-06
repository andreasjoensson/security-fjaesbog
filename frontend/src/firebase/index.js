import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { uploadBytesResumable } from "firebase/storage";

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
  if (!image) return;
  const storageRef = ref(storage, `images/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on("state_changed", (error) => console.log(error));
  await uploadTask; // 👈 uploadTask is a promise itself, so you can await it

  let downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  // 👆 getDownloadURL returns a promise too, so... yay more await

  return downloadURL; // 👈 return the URL to the caller
};

export { uploadImage };
