// Import the 'auth' object from your firebase.js file
import { auth } from "./firebase";

// Example usage in a component
export default signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
  } catch (error) {
    console.error(error.message);
  }
};
