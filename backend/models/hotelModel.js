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
    ORDER BY id DESC;
  `;
  const { rows } = await pool.query(query, [ownerId]);
  return rows;
};

const getAllHotels = async () => {
  const query = `
    SELECT * FROM hotels
    ORDER BY id DESC;
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

const updateHotel = async (
  id,
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
    UPDATE hotels SET
      property_name = COALESCE($2, property_name),
      city = COALESCE($3, city),
      country = COALESCE($4, country),
      starting_price_per_night = COALESCE($5, starting_price_per_night),
      category = COALESCE($6, category),
      stars = COALESCE($7, stars),
      total_rooms = COALESCE($8, total_rooms),
      image_url = COALESCE($9, image_url),
      short_description = COALESCE($10, short_description),
      long_description = COALESCE($11, long_description),
      amenities = COALESCE($12, amenities)
    WHERE id = $1
    RETURNING *;
  `;
  const values = [
    id,
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
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  createHotel,
  updateHotel,
  getHotelsByOwner,
  getAllHotels,
  getHotelById,
};

