import React from "react";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { setCredentials } from "../../slice/userSlice/userAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function OAuth() {

    let dispatch = useDispatch()
    let navigate = useNavigate()


  let auth = getAuth(app);
  let handleGoogleClick = async () => {
    let provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      let resultFromGoogle = await signInWithPopup(auth, provider);
      let res = await fetch("https://bookitt.online/api/users/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
        }),
    });

    let data = await res.json()
    if (res.ok) {
        dispatch(setCredentials(data));
        navigate('/')
    }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GoogleButton style={{ width: "496px" }} onClick={handleGoogleClick} />
  );
}

export default OAuth;
