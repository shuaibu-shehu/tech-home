import { useState } from "react";
import { app } from "../firebase";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { set } from "mongoose";

export const CreateListing = () => {
  const [files, setFiles] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls:[]
  });
  const  [imageUploadError,setImageUploadError]=useState(false)
  const [uploading, setUploading] = useState(false);
  console.log(formData);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true)
        setImageUploadError(false)
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
    Promise.all(promises).then(url=>{
        setFormData({...formData,imageUrls:formData.imageUrls.concat(url)})
         setUploading(false)
    }).catch(err=>{
        setImageUploadError('Image upload failed (2 mb max per image -- only image)');
        setUploading(false)
    })
    } else{
        setImageUploadError('You can upload only 6 images per listing');
        setUploading(false)
    }
  }
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        snapshot => {
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

  return (
    <div className="max-w-4xl m-auto ">
      <h1 className=" text-center text-2xl m-4">Create Listing </h1>

      <form className="flex p-2 gap-4 flex-col sm:flex-row  ">
        <div className=" flex  flex-1 flex-col  gap-3">
          <input
            type="text"
            className="p-3 rounded-lg border-2 outline-slate-600"
            placeholder="name"
            name="name"
            id="name"
          />
          <textarea
            type="text"
            className="p-3  border-2 rounded-lg outline-slate-600"
            placeholder="description"
            name="description"
            id="description"
          />
          <input
            type="text"
            className="p-3 rounded-lg border-2 outline-slate-600"
            placeholder="address"
          />
          <div className=" flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                className="border-2 p-3  outline-slate-600"
                type="number"
              />
              <span>Regular price($)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border-2  p-2 outline-slate-600"
                type="number"
              />
              <span>Discount price ($)</span>
            </div>
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
            >{uploading? 'uploading ...': 'upload'}
            </button>

            <span className="text-red-600">{imageUploadError}</span>
          </div>
            {formData.imageUrls.length>0 && <div className="flex flex-col gap-2">
                   {formData.imageUrls.map((url,index)=>{
                    return <div key={index} className="flex  justify-between">
                        <img src={url} alt="listing image" className="w-20 h-20 rounded-xl"/>
                        <button type="button" onClick={()=>setFormData({...formData,imageUrls:formData.imageUrls.filter((_,i)=>i!==index)})}
                         className=" text-red-600 rounded-md">Delete</button>
                    </div>
                   })}
                </div>}
          <button className="bg-slate-600 uppercase rounded-md text-white p-3">
            Create listing
          </button>
        </div>
      </form>
    </div>
  );
};
