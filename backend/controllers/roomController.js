const roomModel = require("../models/roomModel");

const create = async (req, res) => {
  try {
    const {
      hotelId,
      roomName,
      bedType,
      features,
      extraFeatures,
      pricePerNight,
      imageUrls,
      mode,
      maxPersonCount
    } = req.body;

    if (!hotelId || !roomName || !bedType || !pricePerNight) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const room = await roomModel.createRoom(
      hotelId,
      roomName,
      bedType,
      features,
      extraFeatures,
      pricePerNight,
      imageUrls,
      mode || "active",
      maxPersonCount || 2
    );

    res.status(201).json({
      message: "Room registered successfully",
      room
    });
  } catch (error) {
    console.error("Room creation error:", error);
    res.status(500).json({ error: "Server error during room registration" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      roomName,
      bedType,
      features,
      extraFeatures,
      pricePerNight,
      imageUrls,
      mode,
      maxPersonCount
    } = req.body;

    if (!roomName || !bedType || !pricePerNight) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const room = await roomModel.updateRoom(
      id,
      roomName,
      bedType,
      features,
      extraFeatures,
      pricePerNight,
      imageUrls,
      mode,
      maxPersonCount
    );

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room
    });
  } catch (error) {
    console.error("Room update error:", error);
    res.status(500).json({ error: "Server error during room modification" });
  }
};

const getHotelRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) {
      return res.status(400).json({ error: "Hotel ID is required" });
    }
    const rooms = await roomModel.getRoomsByHotel(hotelId);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Get hotel rooms error:", error);
    res.status(500).json({ error: "Server error retrieving rooms" });
  }
};

module.exports = {
  create,
  update,
  getHotelRooms,
};
