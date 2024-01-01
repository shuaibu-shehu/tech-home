import {useEffect, useState} from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)   
    
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if(searchTermFromUrl) 
    {
      setSearchTerm(searchTermFromUrl);
    } 
  },[location.search])
  
  return (
    <div className=" bg-slate-600 w-full">
      <div className=" relative m-auto flex max-w-4xl gap-2 items-center justify-between py-3 px-2 text-white">
        <p>Tech-Home</p>
        <form onSubmit={handleSubmit} className=" flex gap-1 justify-center items-center  max-w-[250px] min-w-[100px] bg-slate-950 p-3 rounded-lg ">
          <input
            className=" w-[90%] bg-transparent outline-none "
            type="text"
            placeholder="search ...."
            onChange={(e) => setSearchTerm(e.target.value)}
            defaultValue={searchTerm}
          />
          <button onClick={handleSubmit}>
            <FaSearch className=" mx-1" />
          </button>
        </form>
        <ul className="flex justify-between gap-3">
          <Link to="/">
            <li className="hidden sm:block hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className=" hidden sm:block hover:underline">About</li>
          </Link>
          <Link to="/signup">
            <li className="hidden hover:underline">Signup</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile pic"
                className=" rounded-full h-8 min-w-7"
              />
            ) : (
              <li className="hover:underline">Signin</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};
