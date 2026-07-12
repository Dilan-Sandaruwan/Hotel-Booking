const pool = require("../config/db");

/**
 * Check if a room has any confirmed bookings that overlap with the
 * requested date range.  Two bookings overlap when:
 *   existing.check_in  < requested.check_out  AND
 *   existing.check_out > requested.check_in
 *
 * Returns the conflicting booking row, or undefined if available.
 */
const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {
  const query = `
    SELECT id, check_in_date, check_out_date
    FROM bookings
    WHERE room_id = $1
      AND booking_status != 'cancelled'
      AND check_in_date  < $3::date
      AND check_out_date > $2::date
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [roomId, checkInDate, checkOutDate]);
  return rows[0]; // undefined means room is available
};

/**
 * Save a new booking to the database.
 * All monetary values should be numbers (NUMERIC(12,2) in Postgres).
 */
const createBooking = async ({
  userId,
  hotelId,
  roomId,
  firstName,
  lastName,
  email,
  phone,
  specialRequests,
  checkInDate,
  checkOutDate,
  numberOfNights,
  numberOfGuests,
  pricePerNight,
  baseTotal,
  taxesAndFees,
  totalAmount,
  paymentStatus = "paid",
  bookingStatus = "confirmed",
}) => {
  const query = `
    INSERT INTO bookings (
      user_id,
      hotel_id,
      room_id,
      first_name,
      last_name,
      email,
      phone,
      special_requests,
      check_in_date,
      check_out_date,
      number_of_nights,
      number_of_guests,
      price_per_night,
      base_total,
      taxes_and_fees,
      total_amount,
      payment_status,
      booking_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    RETURNING *;
  `;

  const values = [
    userId || null,
    hotelId,
    roomId,
    firstName,
    lastName,
    email,
    phone,
    specialRequests || null,
    checkInDate,
    checkOutDate,
    numberOfNights,
    numberOfGuests,
    pricePerNight,
    baseTotal,
    taxesAndFees,
    totalAmount,
    paymentStatus,
    bookingStatus,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Retrieve all bookings for a given user (for booking history pages).
 */
const getBookingsByUser = async (userId) => {
  const query = `
    SELECT
      b.*,
      h.property_name AS hotel_name,
      h.city AS hotel_city,
      h.image_url AS hotel_image,
      r.room_name
    FROM bookings b
    LEFT JOIN hotels h ON b.hotel_id = h.id
    LEFT JOIN rooms r  ON b.room_id  = r.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

/**
 * Retrieve a single booking by its UUID primary key.
 */
const getBookingById = async (id) => {
  const query = `
    SELECT
      b.*,
      h.property_name AS hotel_name,
      h.city AS hotel_city,
      h.image_url AS hotel_image,
      r.room_name
    FROM bookings b
    LEFT JOIN hotels h ON b.hotel_id = h.id
    LEFT JOIN rooms r  ON b.room_id  = r.id
    WHERE b.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

/**
 * Retrieve all bookings for every hotel owned by a given ownerId.
 */
const getBookingsByOwner = async (ownerId) => {
  const query = `
    SELECT
      b.*,
      h.property_name AS hotel_name,
      h.city          AS hotel_city,
      h.image_url     AS hotel_image,
      r.room_name
    FROM bookings b
    INNER JOIN hotels h ON b.hotel_id = h.id
    LEFT  JOIN rooms  r ON b.room_id  = r.id
    WHERE h.owner_id = $1
    ORDER BY b.created_at DESC;
  `;
  const { rows } = await pool.query(query, [ownerId]);
  return rows;
};

module.exports = {
  createBooking,
  checkRoomAvailability,
  getBookingsByUser,
  getBookingsByOwner,
  getBookingById,
};
