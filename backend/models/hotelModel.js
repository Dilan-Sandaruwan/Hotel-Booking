const pool = require("../config/db");

const createHotel = async (
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
) => {
  const query = `
    INSERT INTO hotels (
      owner_id,
      property_name,
      city,
      country,
      starting_price_per_night,
      category,
      stars,
      total_rooms,
      image_url,
      short_description,
      long_description,
      amenities
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [
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
    amenities || []
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getHotelsByOwner = async (ownerId) => {
  const query = `
    SELECT * FROM hotels
    WHERE owner_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [ownerId]);
  return rows;
};

const getAllHotels = async () => {
  const query = `
    SELECT * FROM hotels
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getHotelById = async (id) => {
  const query = `
    SELECT * FROM hotels
    WHERE id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createHotel,
  getHotelsByOwner,
  getAllHotels,
  getHotelById,
};
