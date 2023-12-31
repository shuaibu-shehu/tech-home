import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
        console.log(data);
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
                  className="h-[500px]   w-[70%] max-w-[1000px] m-auto"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};
