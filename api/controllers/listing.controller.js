const Listing = require("../models/listing.model.js");
const router = require("../routes/listing.route.js");
const { handleError } = require("../utils/error.js");
const { verifyToken } = require("../utils/verifyToken.js");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(handleError(404, "Listing not found"));
    if (req.verifiedUser.id !== listing.userRef)
      return next(handleError(403, "You can only delete your own listings"));
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(handleError(404, "Listing not found"));
  if (req.verifiedUser.id !== listing.userRef)
    return next(handleError(403, "You can only update your own listings"));
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(handleError(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const skip = parseInt(req.query.skip) || 0;
    const startIndex = req.query.startIndex || 0;
    const endIndex = req.query.endIndex || 0;
    const order = req.query.order || "desc";
    const sort = req.query.sort || "createdAt";
    const searchTerm = req.query.searchTerm || "";
    let offer = req.query.offer;
    if (offer === false || offer === undefined) {
      offer = { $in: [false, true] };
    }
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
    }).sort({[sort]:order}).limit(limit).skip(startIndex);
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
module.exports = { createListing, deleteListing, updateListing, getListing, getListings };
