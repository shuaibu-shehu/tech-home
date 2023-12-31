import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export const Contact = ({listing}) => {
    console.log(listing?.userRef);
    const [loading, setLoading] = useState(false);
    const [owner, setOwner] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = listing?.userRef;  
            try {
                const response = await fetch(`/api/user/${listingId}`);
                const data = await response.json();
                if (data.success === false) { 
                setError(data.message);
                setLoading(false); 
               return;
                }
                setOwner(data);  
            } catch (error) {
                setError(error.message);
                console.log(error); 
            }  
        }
        fetchListing();
    },[listing?._id])
    console.log(message);

  return (
    <div className="flex flex-col m-auto justify-center items-center max-w-[600px]">
     {owner && <p>contact {owner.email} for {listing.name}</p>}
        
      <textarea onChange={(e)=>setMessage(e.target.value)} className=" border-2 w-full p-2 focus:outline-slate-600 h-20" placeholder="type a message" name="" id="" cols="30" rows="10"></textarea>
      <Link to={`mailto:${owner?.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-600  text-center m-3 w-full uppercase p-3 text-white rounded-lg">send message</Link>

    </div>
  ) 
}
 