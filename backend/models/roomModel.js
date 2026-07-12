const pool = require("../config/db");

const createRoom = async (
  hotelId,
  roomName,
  bedType,
  features,
  extraFeatures,
  pricePerNight,
  imageUrls,
  mode = "active",
  maxPersonCount = 2
) => {
  const query = `
    INSERT INTO rooms (
      hotel_id,
      room_name,
      bed_type,
      features,
      extra_features,
      price_per_night,
      image_urls,
      mode,
      max_person_count
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    hotelId,
    roomName,
    bedType,
    features || [],
    extraFeatures || [],
    pricePerNight,
    imageUrls || [],
    mode,
    maxPersonCount
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateRoom = async (
  id,
  roomName,
  bedType,
  features,
  extraFeatures,
  pricePerNight,
  imageUrls,
  mode,
  maxPersonCount
) => {
  const query = `
    UPDATE rooms
    SET
      room_name = $2,
      bed_type = $3,
      features = $4,
      extra_features = $5,
      price_per_night = $6,
      image_urls = $7,
      mode = $8,
      max_person_count = $9,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;
  const values = [
    id,
    roomName,
    bedType,
    features || [],
    extraFeatures || [],
    pricePerNight,
    imageUrls || [],
    mode || "active",
    maxPersonCount || 2
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getRoomsByHotel = async (hotelId) => {
  const query = `
    SELECT * FROM rooms
    WHERE hotel_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [hotelId]);
  return rows;
};

module.exports = {
  createRoom,
  updateRoom,
  getRoomsByHotel,
};
