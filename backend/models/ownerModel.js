const pool = require("../config/db");

const createOwner = async (fullName, birthday, contactNumber, businessEmail, nationalIdPassport, passwordHash) => {
  const query = `
    INSERT INTO owners (full_name, birthday, contact_number, business_email, national_id_passport, password_hash)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, full_name, birthday, contact_number, business_email, national_id_passport, created_at, updated_at;
  `;
  const values = [fullName, birthday, contactNumber, businessEmail, nationalIdPassport, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findOwnerByEmail = async (email) => {
  const query = `
    SELECT id, full_name, birthday, contact_number, business_email, national_id_passport, password_hash, created_at, updated_at
    FROM owners
    WHERE business_email = $1;
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

module.exports = {
  createOwner,
  findOwnerByEmail,
};
