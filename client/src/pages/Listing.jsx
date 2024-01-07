import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaLocationArrow} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Contact } from "../components/Contact";

export const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contactOwner, setContactOwner] = useState(false); 
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId.split(" ").join("");
        setLoading(true);
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    }; 
    fetchListing();
  }, []);

  return (
    <div>
      {loading && <div className="m-50 text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {listing && !loading && !error && (
        <>
          <Swiper
            className=" p-2 h-[500px]"
            style={{ backgroundColor: "#323232" }}
            navigation
          >
            {listing.imageUrls.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[500px]   w-[70%] max-w-[800px] m-auto"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    objectFit: "contain",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      <div className="m-3 flex flex-col gap-3">
        <div className=" mx-2 flex gap-2 items-center">
          <p className="text-lg font-semibold uppercase ">
            {/* checking whether there is an offer */}
            {listing?.name} - (
            {(listing?.offer
              ? +listing?.regularPrice - listing?.discountPrice
              : listing?.regularPrice) + "$"}
            )
          </p>
        </div>

        <div className="mx-2 text-sm text-green-900 flex gap-2 items-center">
          <FaLocationArrow className="  inline-block" />
          <p className=" uppercase">{listing?.address}</p>
        </div>
        <p className="text-white border-green-700 border bg-slate-600 w-32 text-center p-2">${listing?.discountPrice} discount</p>
        <p className="uppercase">{listing?.description}</p>
      </div>
      {
        currentUser && currentUser._id !== listing?.userRef && !contactOwner && (
          <div className=" w-full flex gap-3">
            <button onClick={()=>setContactOwner(true)} className="bg-slate-600 m-auto my-3 text-white p-3 px-7 uppercase w-[600px] rounded-lg">contact owner</button>

          </div>
        )
    }
    {contactOwner && <Contact listing={listing} />}
    </div>
  );
};
