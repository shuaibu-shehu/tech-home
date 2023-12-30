import React from "react";
import {FaSearch} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className=" bg-slate-600 w-full">
      <div className=" relative m-auto flex max-w-4xl gap-2 items-center justify-between py-3 px-2 text-white">
        <p>Tech-Home</p>
        <div className=" flex gap-1 justify-center items-center  max-w-[250px] min-w-[100px] bg-slate-950 p-3 rounded-lg ">
          <input
            className=" w-[90%] bg-transparent outline-none "
            type="text"
            placeholder="search ...."
          />  
          <FaSearch className=" mx-1"/>
        </div>
        <ul className="flex justify-between gap-3">  
        <Link to='/'>
          <li className="hidden sm:block hover:underline">Home</li>
        </Link>
        <Link to='/about'>
          <li className=" hidden sm:block hover:underline">About</li>
        </Link>
        <Link to='/signup'>
          <li className="hidden hover:underline">Signup</li>
        </Link>
        <Link to='/profile'>
          { currentUser? <img src={currentUser.avatar} alt="profile pic" className=" rounded-full h-8 min-w-7"/>:
          <li className="hover:underline">Signin</li>
           }
        </Link>
        </ul>
      </div>
    </div>
  );
};
