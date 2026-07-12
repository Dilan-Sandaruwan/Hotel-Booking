const pool = require("../config/db");

const createUser = async (fullName, email, passwordHash, termsAccepted) => {
  const query = `
    INSERT INTO users (full_name, email, password_hash, terms_accepted)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, terms_accepted, auth_provider, created_at, updated_at;
  `;
  const values = [fullName, email, passwordHash, termsAccepted];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT id, full_name, email, password_hash, terms_accepted, auth_provider, created_at, updated_at
    FROM users
    WHERE email = $1;
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
