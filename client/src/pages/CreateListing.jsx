import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";


export const CreateListing = () => {
  const [files, setFiles] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userRef: currentUser._id,
    imageUrls: [],
    name: "dffef",
    description: "",
    address: "",
    regularPrice: 20,
    discountPrice: 20,
    offer: false,
  });
  console.log(formData);

  const handleImageSubmit = () => {
    
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Image upload failed (2 mb max per image -- only image)"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload only 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "offer") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError("Please add atleast 1 image");
    if(+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be less than regular price");
    try {
      setLoading(true);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success==false){
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      navigate(`/lisitng/${data._id}`);
  
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl m-auto ">
      <h1 className=" text-center text-2xl m-4">Create Listing </h1>

      <form
        onSubmit={handleSubmit}
        className="flex p-2 gap-4 flex-col sm:flex-row  "
      >
        <div className=" flex  flex-1 flex-col  gap-3">
          <input
            type="text"
            className="p-3 rounded-lg border-2 outline-slate-600"
            placeholder="name"
            name="name"
            id="name"
            minLength={10}
            maxLength={62}
            required
            onChange={handleChange}
          />
          <textarea
            type="text"
            className="p-3  border-2 rounded-lg outline-slate-600"
            placeholder="description"
            name="description"
            id="description"
            required
            onChange={handleChange}
            defaultValue={formData.description}
          />
          <input
            type="text"
            className="p-3 rounded-lg border-2 outline-slate-600"
            placeholder="address"
            name="address"
            id="address"
            required
            onChange={handleChange}
            defaultValue={formData.address}
          />
          <div className=" flex flex-col gap-3">
            <div className="flex gap-2">
              <input type="checkbox" onChange={handleChange} defaultValue={formData.offer} id="offer" />
              <label htmlFor="offer">offer</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="border-2 p-3 w-32 outline-slate-600"
                type="number"
                onChange={handleChange}
                defaultValue={formData.regularPrice}
                min={20}
                max={10000}
                name="regularPrice"
              />
              <span>Regular price($)</span>
            </div>
        
           {formData.offer && 
            <div className="flex items-center gap-3">
            <input
              className="border-2  p-3 w-32 outline-slate-600"
              type="number"
              onChange={handleChange}
              defaultValue={formData.discountPrice}
              min={20}
              max={10000}
              name="discountPrice"
            />
            <span>Discount price ($)</span>
          </div>}
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          <div>
            <span className=" font-semibold">Images</span>: the first image will
            be the cover (max 6)
          </div>
          <div className="flex flex-wrap gap-2 p-1">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              multiple
              id="images"
              accept="image/*"
              className=" rounded-md border-2 p-2"
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="p-3 rounded-xl border-2 uppercase hover:shadow-lg border-slate-300"
            >
              {uploading ? "uploading ..." : "upload"}
            </button>

           {imageUploadError &&  <span className="text-center text-red-600">{imageUploadError}</span>}
          </div>
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {formData.imageUrls.map((url, index) => {
                return (
                  <div key={index} className="flex  justify-between">
                    <img
                      src={url}
                      alt="listing image"
                      className="w-20 h-20 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          imageUrls: formData.imageUrls.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                      className=" text-red-600 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <button disabled={loading || uploading} className="bg-slate-600 uppercase rounded-md text-white p-3">
           {loading? 'creating ....':'Create listing'}
          </button>
          {error && <span className="text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
};
