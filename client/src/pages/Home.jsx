import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import { ListingCard } from "../components/ListingCard";
import "swiper/css/bundle";

export const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [recentAddedListings, setRecentAddedListings] = useState([]);
console.log(recentAddedListings);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch("/api/listing/get?offer=true");
        const data = await response.json();
        setOfferListings(data);
        fetchRecentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRecentListings = async () => {
      try {
        const response = await fetch("/api/listing/get?sort=createdAt&order=desc&limit=4");
        const data = await response.json();
        setRecentAddedListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);
  return (
    <div className="">
      {/* top  */}
      <div className="flex max-w-xl p-6 sm:p-20 flex-col gap-4">
        <h1 className="uppercase font-semibold text-2xl sm:text-4xl">
          find your <span className="text-indigo-900 text-">Desired</span>{" "}
          <br /> machine with us
        </h1>
        <div className=" text-gray-500">
          TechHome is the best place to find your personal comuputer, we have a
          wide range of machines for you to choose from, with the best offers
          and prices in the market.
        </div>
        <Link to={'/search'}>lets get started</Link>
      </div>

      {/* swiper */}
        <Swiper 
        className="w-full h-[400px] sm:h-[500px]"
        navigation>
          {recentAddedListings.map((listing) => (
            <SwiperSlide className="bg-gray-500">
             <div
             style={{
              backgroundImage: `url(${listing.imageUrls[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              objectFit: "contain",
            }}
             className="w-full m-auto h-full sm:max-w-[800px]">

             </div>
            </SwiperSlide>
          ))}

        </Swiper>
         
      {/* listings for offer, sale and rent */}
      {offerListings && offerListings.length > 0 && (
        <div className=" flex flex-col px-6 sm:px-20"> 
          <div className="my-3"> 
            <p className=" capitalize ">recent offers </p>
            <Link className="hover:underline text-green-700" to={`/search/?offer=false`}>see more offers</Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {offerListings.map((listing) => (
              <ListingCard listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
