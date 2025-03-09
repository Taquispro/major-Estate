import mongoose from "mongoose";
const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    ameneties: {
      type: Number,
      required: true,
    },
    balconies: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Listing = mongoose.model("Listing2", listingSchema);
export default Listing;
