import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../redux/user/userSlicer.js";
import { useNavigate } from "react-router-dom";

export const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClck = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signinSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google");
    }
  };

  return (
    <button
      onClick={handleGoogleClck}
      type="button"
      className="  rounded-md  outline-none m-2 hover:opacity-90 text-white p-2 py-3 bg-red-950"
    >
      Continue with google
    </button>
  );
};
