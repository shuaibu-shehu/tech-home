import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector ,useDispatch } from "react-redux";
import {signinStart, signinSuccess, signinFailure} from '../redux/user/userSlicer.js'
import { Oauth } from "../components/Oauth.jsx";
 
export const Signin = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {error, loading, currentUser} = useSelector(state => state.user)
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {

    e.preventDefault();;
    dispatch(signinStart())
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success === false) {
      console.log("erro");
      dispatch(signinFailure(data.message))
      return;
    }
    dispatch(signinSuccess(data))
    navigate("/");
  };
  return (
    <div className=" w-[100%] my-2 m-auto flex flex-col items-center justify-center">
      <h1 className=" text-2xl text-indigo-950 font-bold">Sign in</h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-md w-[90%] max-w-[600px]  m-3 p-4 flex flex-col "
      >
       
        <input
          onChange={handleInput}
          className="rounded-md  outline-none m-2 text-white bg-indigo-950 p-2 py-3"
          type="text"
          name="email"
          placeholder="email"
        />
        <input
          onChange={handleInput}
          className="rounded-md  outline-none m-2 text-white bg-indigo-950 p-2 py-3"
          type="password"
          name="password"
          placeholder="password"
        />
        <button
          className=" rounded-md  outline-none m-2 text-white p-2 py-3 bg-slate-600"
          type="submit"
        >
          {loading ? "loading..." : "sign in"}
        </button>
       <Oauth />
        {error && <p className=" text-center">{error}</p>}
        <p className=" text-center">
          dont have an account?{" "}
          <Link className="text-red-950 text-lg font-bold" to={"/signup"}>
            signup
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};
