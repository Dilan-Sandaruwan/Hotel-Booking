const pool = require("./db");

const seedDatabase = async () => {
  try {
    console.log("🌱 Checking if database seeding is required...");

    // ── 0. Schema Migration: Create all tables in order if they don't exist ──
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        terms_accepted BOOLEAN NOT NULL DEFAULT false,
        auth_provider VARCHAR(50) DEFAULT 'local',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ users table ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS owners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        birthday DATE,
        contact_number VARCHAR(50),
        business_email VARCHAR(255) UNIQUE NOT NULL,
        national_id_passport VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ owners table ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
        property_name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        starting_price_per_night NUMERIC(12, 2) NOT NULL,
        category VARCHAR(100),
        stars INTEGER,
        total_rooms INTEGER,
        image_url TEXT,
        short_description TEXT,
        long_description TEXT,
        amenities TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ hotels table ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
        room_name VARCHAR(255) NOT NULL,
        bed_type VARCHAR(100),
        features TEXT[],
        extra_features TEXT[],
        price_per_night NUMERIC(12, 2) NOT NULL,
        image_urls TEXT[],
        mode VARCHAR(50) DEFAULT 'active',
        max_person_count INTEGER DEFAULT 2,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ rooms table ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id  UUID REFERENCES users(id)  ON DELETE SET NULL,
        hotel_id UUID REFERENCES hotels(id) ON DELETE RESTRICT,
        room_id  UUID REFERENCES rooms(id)  ON DELETE RESTRICT,

        first_name       VARCHAR(255) NOT NULL,
        last_name        VARCHAR(255) NOT NULL,
        email            VARCHAR(255) NOT NULL,
        phone            VARCHAR(50)  NOT NULL,
        special_requests TEXT,

        check_in_date     DATE    NOT NULL,
        check_out_date    DATE    NOT NULL,
        number_of_nights  INTEGER NOT NULL CHECK (number_of_nights  > 0),
        number_of_guests  INTEGER NOT NULL CHECK (number_of_guests  > 0),

        price_per_night  NUMERIC(12, 2) NOT NULL,
        base_total       NUMERIC(12, 2) NOT NULL,
        taxes_and_fees   NUMERIC(12, 2) NOT NULL,
        total_amount     NUMERIC(12, 2) NOT NULL,

        payment_status   VARCHAR(50) NOT NULL DEFAULT 'pending',
        booking_status   VARCHAR(50) NOT NULL DEFAULT 'confirmed',

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
      );

      CREATE INDEX IF NOT EXISTS idx_bookings_user_id  ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON bookings(hotel_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_dates    ON bookings(check_in_date, check_out_date);
    `);
    console.log("✅ bookings table ready.");

    // 1. Create default owner if not exists
    const ownerCheck = await pool.query("SELECT id FROM owners LIMIT 1");
    let ownerId;

    if (ownerCheck.rows.length === 0) {
      console.log("🌱 Creating default owner...");
      const newOwner = await pool.query(`
        INSERT INTO owners (
          full_name,
          birthday,
          contact_number,
          business_email,
          national_id_passport,
          password_hash
        )
        VALUES (
          'LuxeStay Owner',
          '1985-05-15',
          '+94 77 123 4567',
          'owner@luxestay.com',
          '951234567V',
          '$2b$10$rY2D/JjZ2w3.lO/T.3Gv3uz1z1aJj92h.W4c7g9J8Tq9eR0uK/S8y'
        )
        RETURNING id;
      `);
      ownerId = newOwner.rows[0].id;
      console.log("🌱 Default owner created:", ownerId);
    } else {
      ownerId = ownerCheck.rows[0].id;
    }

    // 2. Check if hotels table is empty
    const hotelCheck = await pool.query("SELECT id FROM hotels LIMIT 1");

    if (hotelCheck.rows.length === 0) {
      console.log("🌱 Seeding default hotels...");

      // Hotel 1: Ella Eco Resort
      const hotel1 = await pool.query(`
        INSERT INTO hotels (
          owner_id, property_name, city, country, starting_price_per_night,
          category, stars, total_rooms, image_url, short_description,
          long_description, amenities
        )
        VALUES (
          $1, 'Ella Eco Resort', 'Ella', 'Sri Lanka', 12000.00,
          'Resort', 5, 10, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          'Eco-friendly resort in the hills of Ella.',
          'A premium eco-friendly resort located in the heart of Ella, Sri Lanka. Offering breathtaking views of mountain ranges, lush tea estates, and the famous Ella Rock.',
          ARRAY['Free WiFi', 'Free parking', 'Spa & Wellness', 'Fitness Center', 'Air conditioning', '24-Hour Front Desk']
        )
        RETURNING id;
      `, [ownerId]);
      const hotel1Id = hotel1.rows[0].id;

      // Rooms for Hotel 1
      await pool.query(`
        INSERT INTO rooms (hotel_id, room_name, bed_type, features, extra_features, price_per_night, image_urls, mode, max_person_count)
        VALUES 
        ($1, 'Deluxe 101', '1 Double bed', ARRAY['WiFi', 'TV', 'Sea View'], ARRAY['Balcony'], 12000.00, ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'], 'active', 2),
        ($1, 'Family Suite 102', '2 Double beds', ARRAY['WiFi', 'TV', 'Sea View', 'AC'], ARRAY['Balcony', 'Mini Bar'], 18000.00, ARRAY['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'], 'active', 4)
      `, [hotel1Id]);

      // Hotel 2: Grand Luxury Villa
      const hotel2 = await pool.query(`
        INSERT INTO hotels (
          owner_id, property_name, city, country, starting_price_per_night,
          category, stars, total_rooms, image_url, short_description,
          long_description, amenities
        )
        VALUES (
          $1, 'Grand Luxury Villa', 'Colombo', 'Sri Lanka', 25000.00,
          'Luxury', 5, 5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          'Ultra-premium private villa in Colombo.',
          'Experience true luxury at the Grand Luxury Villa. Located in the exclusive suburbs of Colombo, offering private pools, butler service, and world-class fine dining.',
          ARRAY['Free WiFi', 'Private Pool', 'Butler Service', 'Fitness Center', 'Spa', 'Airport Shuttle']
        )
        RETURNING id;
      `, [ownerId]);
      const hotel2Id = hotel2.rows[0].id;

      // Rooms for Hotel 2
      await pool.query(`
        INSERT INTO rooms (hotel_id, room_name, bed_type, features, extra_features, price_per_night, image_urls, mode, max_person_count)
        VALUES 
        ($1, 'Royal Pool Villa', '1 King Bed', ARRAY['WiFi', 'TV', 'AC', 'Private Pool'], ARRAY['Bathtub', 'Mini Bar'], 25000.00, ARRAY['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'], 'active', 2),
        ($1, 'Presidential Penthouse', '2 King Beds', ARRAY['WiFi', 'TV', 'AC', 'Private Pool', 'Kitchen'], ARRAY['Jacuzzi', 'Mini Bar', 'Butler Room'], 45000.00, ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'], 'active', 6)
      `, [hotel2Id]);

      // Hotel 3: Ocean Breeze Boutique Hotel
      const hotel3 = await pool.query(`
        INSERT INTO hotels (
          owner_id, property_name, city, country, starting_price_per_night,
          category, stars, total_rooms, image_url, short_description,
          long_description, amenities
        )
        VALUES (
          $1, 'Ocean Breeze Boutique Hotel', 'Galle', 'Sri Lanka', 15000.00,
          'Boutique', 4, 15, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          'Stylish boutique hotel right next to the beach.',
          'A cozy and stylish boutique hotel overlooking the golden beaches of Galle, Sri Lanka. Perfect for couples, beach lovers, and historic Galle Fort explorations.',
          ARRAY['Free WiFi', 'Beachfront', 'Bar & Lounge', 'Air conditioning', 'Outdoor Pool']
        )
        RETURNING id;
      `, [ownerId]);
      const hotel3Id = hotel3.rows[0].id;

      // Rooms for Hotel 3
      await pool.query(`
        INSERT INTO rooms (hotel_id, room_name, bed_type, features, extra_features, price_per_night, image_urls, mode, max_person_count)
        VALUES 
        ($1, 'Ocean View King Room', '1 King Bed', ARRAY['WiFi', 'TV', 'AC', 'Ocean View'], ARRAY['Balcony'], 15000.00, ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'], 'active', 2)
      `, [hotel3Id]);

      console.log("🌱 Database successfully seeded with default hotels & rooms!");
    } else {
      console.log("🌱 Hotels already exist. No seeding required.");
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  }
};

module.exports = seedDatabase;
