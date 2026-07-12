const hotelModel = require("../models/hotelModel");
const roomModel = require("../models/roomModel");

const create = async (req, res) => {
  try {
    const {
      ownerId,
      propertyName,
      city,
      country,
      startingPricePerNight,
      category,
      stars,
      totalRooms,
      imageUrl,
      shortDescription,
      longDescription,
      amenities
    } = req.body;
    let resolvedOwnerId = ownerId;
    if (!resolvedOwnerId && req.body.ownerEmail) {
      const ownerModel = require("../models/ownerModel");
      const owner = await ownerModel.findOwnerByEmail(req.body.ownerEmail);
      if (owner) {
        resolvedOwnerId = owner.id;
      }
    }

    if (!resolvedOwnerId || !propertyName || !city || !country || !startingPricePerNight || !category || !stars || !totalRooms || !shortDescription || !longDescription) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const hotel = await hotelModel.createHotel(
      resolvedOwnerId,
      propertyName,
      city,
      country,
      startingPricePerNight,
      category,
      stars,
      totalRooms,
      imageUrl,
      shortDescription,
      longDescription,
      amenities
    );

    res.status(201).json({
      message: "Hotel registered successfully",
      hotel
    });
  } catch (error) {
    console.error("Hotel creation error:", error);
    res.status(500).json({ error: "Server error during hotel registration" });
  }
};

const getOwnerHotels = async (req, res) => {
  try {
    let { ownerId } = req.params;
    const { email } = req.query;

    if ((!ownerId || ownerId === "undefined" || ownerId === "null" || ownerId === "") && email) {
      const ownerModel = require("../models/ownerModel");
      const owner = await ownerModel.findOwnerByEmail(email);
      if (owner) {
        ownerId = owner.id;
      }
    }

    if (!ownerId || ownerId === "undefined" || ownerId === "null" || ownerId === "") {
      return res.status(400).json({ error: "Owner ID or email parameter is required" });
    }
    const hotels = await hotelModel.getHotelsByOwner(ownerId);
    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await roomModel.getRoomsByHotel(hotel.id);
        return { ...hotel, rooms };
      })
    );
    res.status(200).json(hotelsWithRooms);
  } catch (error) {
    console.error("Get owner hotels error:", error);
    res.status(500).json({ error: "Server error retrieving hotels" });
  }
};

const getAll = async (req, res) => {
  try {
    const hotels = await hotelModel.getAllHotels();
    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await roomModel.getRoomsByHotel(hotel.id);
        return { ...hotel, rooms };
      })
    );
    res.status(200).json(hotelsWithRooms);
  } catch (error) {
    console.error("Get all hotels error:", error);
    res.status(500).json({ error: "Server error retrieving hotels" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.getHotelById(id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    const rooms = await roomModel.getRoomsByHotel(hotel.id);
    res.status(200).json({ ...hotel, rooms });
  } catch (error) {
    console.error("Get hotel by id error:", error);
    res.status(500).json({ error: "Server error retrieving hotel" });
  }
};

module.exports = {
  create,
  getOwnerHotels,
  getAll,
  getById,
};
