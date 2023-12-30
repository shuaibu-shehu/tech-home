import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlicer.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export const Profile = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  console.log(currentUser);
  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  const handleUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
  return (
    <div className=" max-w-lg m-auto my-2">
      <h1 className="text-2xl font-semibold text-center">Profile</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-1 m-auto">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile picture"
          className="  rounded-full m-auto h-24 w-24"
        />
        <p className="text-center">
          <span className="text-red-700">
            {fileUploadError && "error uploading file"}
          </span>
          {filePercent > 0 && filePercent < 100 && `uploading ${filePercent}%`}
          <span className="text-green-600">
            {filePercent === 100 &&
              fileUploadError === false &&
              `file uploaded ${filePercent}%`}
          </span>
        </p>
        <input
          onChange={handleChange}
          defaultValue={currentUser.name}
          placeholder="username"
          className=" rounded-md outline-none m-2 text-white bg-indigo-950 p-2 py-3"
          type="text"
          id="name"
        />
        <input
          onChange={handleChange}
          defaultValue={currentUser.email}
          placeholder="email"
          className=" rounded-md   outline-none m-2 text-white bg-indigo-950 p-2 py-3"
          type="text"
          id="email"
        />
        <input
          onChange={handleChange}
          defaultValue={currentUser.password}
          placeholder="password"
          className=" rounded-md   outline-none m-2 text-white bg-indigo-950 p-2 py-3"
          type="password"
          id="password"
        />
        <button
         disabled={loading}
          className=" rounded-md  text-lg outline-none m-2 text-white p-2 py-3 bg-red-950"
          type="submit"
        >{loading? 'loading ...': 'update'}
        </button>
      <Link to={'/listing'} className=" bg-green-700 text-white p-3 rounded-lg text-center text-lg mx-2">Creater List</Link>
      </form>
      <div className="flex justify-between m-2">
        <span onClick={handleDelete} className="text-red-700">delete acount</span>
        <span onClick={handleSignOut} className=" text-red-700">sign out</span>
      </div>
      <p className="text-red-700 text-center">{error? error :''}</p>
      <p className="text-green-700 text-center">{updateSuccess? 'usuccessfully updated profile' :''}</p>
    </div>
  );
};
