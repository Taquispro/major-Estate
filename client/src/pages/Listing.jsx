import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules"; // Correct import
import "swiper/css/bundle";
import SwiperCore from "swiper";

function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(listing);
  SwiperCore.use(Navigation);
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
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-wxl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-wxl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <Swiper
          navigation
          keyboard={{ enabled: true }} // Enable arrow key navigation
          modules={[Navigation, Keyboard]} // Use both Navigation & Keyboard
          className="w-full h-[60vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]"
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
      )}
    </main>
  );
}

export default Listing;
