import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import { MdSquareFoot, MdLocalGroceryStore, MdBalcony } from "react-icons/md";

import "swiper/css/bundle";
import SwiperCore from "swiper";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaTrain,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  SwiperCore.use(Navigation);

  useEffect(() => {
    if (listing && listing.type === "sale") {
      // Fetch predicted price only for sale properties
      const fetchPredictedPrice = async () => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/predict/${params.listingId}`
          );
          const data = await res.json();
          if (data) {
            setPredictedPrice(Math.round(data));
          }
        } catch (error) {
          console.error("Error fetching predicted price:", error);
        }
      };

      fetchPredictedPrice();
    }
  }, [params.listingId, listing]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const mapContainerStyle = { width: "100%", height: "300px" };

  return (
    <main>
      {loading && <p className="text-center my-7 text-xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper
            navigation
            keyboard={{ enabled: true }}
            modules={[Navigation, Keyboard]}
            className="w-full h-[60vh]"
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide
                key={url}
                className="flex justify-center items-center bg-black"
              >
                <img
                  src={url}
                  alt="Listing"
                  className="w-full h-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ₹
              {listing.offer
                ? ` ${listing.discountPrice.toLocaleString()}${
                    listing.type === "sale" ? " lakhs" : ""
                  }`
                : ` ${listing.regularPrice.toLocaleString()}${
                    listing.type === "sale" ? " lakhs" : ""
                  }`}
              {listing.type === "rent" && " / month"}
            </p>

            {/* ✅ Show predicted price only if it's a sale property */}
            {listing.type === "sale" && (
              <p
                className={`text-lg font-semibold ${
                  predictedPrice
                    ? listing.regularPrice > predictedPrice
                      ? "text-red-600" // If regular price is higher than predicted, make it red
                      : "text-green-600" // Else, make it green
                    : "text-gray-500"
                }`}
              >
                Predicted Price:{" "}
                {predictedPrice ? `₹ ${predictedPrice} lakhs` : "Loading..."}
              </p>
            )}

            <p className="flex items-center gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            {/* Google Maps Section */}
            {listing.lat && listing.long && (
              <div
                style={{
                  border: "2px solid #B0B0B0",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  margin: "20px 0",
                }}
              >
                <LoadScript googleMapsApiKey={import.meta.env.VITE_MAP}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: listing.lat, lng: listing.long }}
                    zoom={15}
                  >
                    <Marker
                      position={{ lat: listing.lat, lng: listing.long }}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
            )}

            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>

            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4">
              <li className="flex items-center gap-1">
                <FaBed className="text-lg" /> {listing.bedrooms}{" "}
                {listing.bedrooms > 1 ? "beds" : "bed"}
              </li>
              <li className="flex items-center gap-1">
                <FaBath className="text-lg" /> {listing.bathrooms}{" "}
                {listing.bathrooms > 1 ? "baths" : "bath"}
              </li>
              <li className="flex items-center gap-1">
                <FaParking className="text-lg" />{" "}
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1">
                <FaChair className="text-lg" />{" "}
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
              <li className="flex items-center gap-1">
                <MdSquareFoot className="text-lg" />{" "}
                {listing.area + " sq meter area"}
              </li>
              <li className="flex items-center gap-1">
                <FaTrain className="text-lg" />{" "}
                {listing.distance + " km from station"}
              </li>
              <li className="flex items-center gap-1">
                <MdLocalGroceryStore className="text-lg" /> {listing.ameneties}{" "}
                Ameneties
              </li>
              <li className="flex items-center gap-1">
                <MdBalcony className="text-lg" /> {listing.balconies} Balconies
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
}

export default Listing;
