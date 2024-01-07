import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingCard } from "../components/ListingCard";

export const Search = () => {
  const [listings, setListings] = useState([]);
  const [showMore, setshowMore]=useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    offer: false,
    order: "desc",
    sort: "createdAt",
  });

  const handleChange = (e) => {
    if (e.target.name === "offer") {
      setSidebarData({
        ...sidebarData,
        [e.target.name]: !sidebarData.offer,
      });
      return;
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setSidebarData({
        ...sidebarData,
        sort,
        order,
      });
      return;
    }
    setSidebarData({
      ...sidebarData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("order", `${sidebarData.order}`);
    urlParams.set("sort", `${sidebarData.sort}`);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    let offerFromUrl = urlParams.get("offer");
    offerFromUrl = offerFromUrl === "true" ? true : false;
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (searchTermFromUrl || offerFromUrl || sortFromUrl) {
      setSidebarData({
        offer: offerFromUrl || false,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchSearchResults = async () => {
      setshowMore(false);
      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await response.json();
      if(data.length>8){
        setshowMore(true);
      } else{
        setshowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchSearchResults();
  }, [location.search]);

  const onShowMoreClick=async ()=>{
      const numberOfListings=listings.length;
      const startIndex=numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      const res = await  fetch(`/api/listing/get?${searchQuery}`);
      const data =await res.json();
      if(data.length<9){
          setshowMore(false);
      }
      setListings([...listings, ...data]);
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 md:min-h-screen border-b-2 md:border-r-2 ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center gap-2 ">
            <label className="font-semibold whitespace-nowrap">
              Search Term:
            </label>
            <input
              type="text"
              name="search"
              placeholder="search..."
              id="searchTerm"
              className="border-2 bg-slate-200 text-sm  border-slate-700 rounded-md p-2"
              onChange={(e) => handleChange(e)}
              defaultValue={sidebarData.searchTerm}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <label className="font-semibold">Type:</label>
              <input
                type="checkbox"
                name="offer"
                id="offer"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <label htmlFor="offer">offer</label>{" "}
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-semibold">sort:</label>
              <select
                onChange={handleChange}
                id="sort_order"
                className=" border p-2 rounded-md"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>
          <button className="bg-slate-700 text-white rounded-lg  uppercase p-2 w-60 m-auto">
            search
          </button>
        </form>
      </div>
      <div className="w-full p-3">
        <h1 className="text-3xl font-semibold text-center">Listing Result</h1>
        {loading && <p className="m-4 text-center">loading...</p>}
        {listings.length === 0 && !loading && (
          <p className="m-4 text-center">no results found</p>
        )}
        <div className="flex flex-wrap justify-center p-5 gap-3 ">
          {listings &&
            listings.map((listing) => {
              return <ListingCard key={listing._id} listing={listing} />;
            })}
        </div>
        {showMore && <button 
        className="text-center text-green-700 w-full underline"
        onClick={onShowMoreClick}>
          show more
          </button>}
      </div>
    </div>
  );
};
