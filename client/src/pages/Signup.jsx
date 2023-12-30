import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success === false) {
      console.log("erro");
      setLoading(false);
      setError(data.message);
      return;
    }
    setLoading(false);
    setError(null);
    navigate("/signin");
  };
  return (
    <div className=" w-[100%] my-2 m-auto flex flex-col items-center justify-center">
      <h1 className=" text-2xl text-indigo-950 font-bold">Sign up</h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-md w-[90%] max-w-[600px]  m-3 p-4 flex flex-col "
      >
        <input
          onChange={handleInput}
          className=" rounded-md  outline-none m-2 text-white bg-indigo-950 p-2 py-3"
          type="text"
          name="name"
          placeholder="username"
        />
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
          className=" rounded-md  outline-none m-2 text-white p-2 py-3 bg-red-950"
          type="submit"
        >
          {loading ? "loading..." : "sign up"}
        </button>
        {error && <p className=" text-center">{error}</p>}
        <p className=" text-center">
          have an account?{" "}
          <Link className="text-red-950 text-lg font-bold" to={"/signin"}>
            signin
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};
