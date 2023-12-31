import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export const ListingCard = ({ listing }) => {
  return (
    <div className="bg-gray-300  shadow-lg rounded-lg w-[300px] sm:w-[320px] flex flex-col gap-4 ">
      <Link
        className="flex overflow-hidden rounded-lg flex-col"
        to={`/listing/${listing._id}`}
      >
        <img
          className="hover:scale-105 transition-scale duration-300 h-[200px] sm:h-64 w-full  object-cover"
          src={listing.imageUrls[0]}
          alt="listing"
        />
        <div className="px-3 my-4 flex flex-col gap-2">
          <p className=" text-lg  font-semibold truncate">{listing.name}</p>
          <div className="flex gap-2">
            <span className="text-green-900">
              <MdLocationOn />
            </span>
            <p className="text-xs  sm:text-sm gap-1 truncate">
              <span>{listing.address}</span>
            </p>
          </div>
          <p className=" text-sm line-clamp-1">{listing.description}</p>
          <p className="p-2   font-bold bg-emerald-900 text-center rounded-lg text-white text-xs sm:text-sm">
            {listing.regularPrice}$ price
          </p>
          <p className="p-2 font-bold bg-red-600 text-center rounded-lg text-white text-xs sm:text-sm">
            {listing.discountPrice}$ discount
          </p>
        </div>
      </Link>
    </div>
  );
};
