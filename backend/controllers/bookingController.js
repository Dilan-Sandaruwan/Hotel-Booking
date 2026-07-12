const bookingModel = require("../models/bookingModel");

/**
 * POST /api/bookings
 * Body: { userId?, hotelId, roomId, firstName, lastName, email, phone,
 *         specialRequests?, checkInDate, checkOutDate, numberOfNights,
 *         numberOfGuests, pricePerNight, baseTotal, taxesAndFees, totalAmount }
 */
const create = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // --- Basic validation ---
    if (
      !hotelId ||
      !roomId ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfNights ||
      !numberOfGuests ||
      pricePerNight === undefined ||
      baseTotal === undefined ||
      taxesAndFees === undefined ||
      totalAmount === undefined
    ) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    // ── Double-booking prevention ────────────────────────────────
    const conflict = await bookingModel.checkRoomAvailability(
      roomId,
      checkInDate,
      checkOutDate
    );
    if (conflict) {
      return res.status(409).json({
        error: "Room is already booked for the selected dates",
        conflictingBooking: {
          id: conflict.id,
          checkIn: conflict.check_in_date,
          checkOut: conflict.check_out_date,
        },
      });
    }
    // ─────────────────────────────────────────────────────────────

    const booking = await bookingModel.createBooking({
      userId: userId || null,
      hotelId,
      roomId,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
      checkInDate,
      checkOutDate,
      numberOfNights: Number(numberOfNights),
      numberOfGuests: Number(numberOfGuests),
      pricePerNight: Number(pricePerNight),
      baseTotal: Number(baseTotal),
      taxesAndFees: Number(taxesAndFees),
      totalAmount: Number(totalAmount),
      paymentStatus: "paid",
      bookingStatus: "confirmed",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ error: "Server error during booking creation" });
  }
};

/**
 * GET /api/bookings/user/:userId
 * Returns all bookings for a user including hotel/room details.
 */
const getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const bookings = await bookingModel.getBookingsByUser(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Server error retrieving bookings" });
  }
};

/**
 * GET /api/bookings/:id
 * Returns a single booking by its UUID.
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingModel.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Server error retrieving booking" });
  }
};

/**
 * GET /api/bookings/owner/:ownerId
 * Returns all bookings across every hotel owned by the given owner.
 * Protected by authOwner middleware in the route.
 */
const getByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!ownerId) {
      return res.status(400).json({ error: "ownerId is required" });
    }
    const bookings = await bookingModel.getBookingsByOwner(ownerId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get owner bookings error:", error);
    res.status(500).json({ error: "Server error retrieving owner bookings" });
  }
};

/**
 * GET /api/bookings/check-availability?roomId=...&checkIn=...&checkOut=...
 * Returns { available: true/false } so the frontend can warn users
 * before they fill out the booking form.
 */
const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "roomId, checkIn and checkOut are required" });
    }
    const conflict = await bookingModel.checkRoomAvailability(roomId, checkIn, checkOut);
    res.status(200).json({
      available: !conflict,
      conflict: conflict
        ? { checkIn: conflict.check_in_date, checkOut: conflict.check_out_date }
        : null,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({ error: "Server error checking availability" });
  }
};

module.exports = { create, getByUser, getByOwner, getById, checkAvailability };
