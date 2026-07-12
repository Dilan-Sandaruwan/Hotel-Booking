const crypto = require("crypto");
const ownerModel = require("../models/ownerModel");

// Helper: Hash password using native crypto module
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

// Helper: Verify password using native crypto module
function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, originalHash] = storedHash.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

// Helper: Generate a JWT-like token natively
function generateToken(payload) {
  const secret = process.env.JWT_SECRET || "luxestay_fallback_secret_key";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
    
  return `${header}.${body}.${signature}`;
}

const register = async (req, res) => {
  try {
    const { fullName, birthday, contactNumber, businessEmail, nationalIdPassport, password } = req.body;

    if (!fullName || !birthday || !contactNumber || !businessEmail || !nationalIdPassport || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailLower = businessEmail.toLowerCase().trim();

    // Check if owner already exists
    const existingOwner = await ownerModel.findOwnerByEmail(emailLower);
    if (existingOwner) {
      return res.status(400).json({ error: "Business email is already registered" });
    }

    const passwordHash = hashPassword(password);
    const newOwner = await ownerModel.createOwner(
      fullName,
      birthday,
      contactNumber,
      emailLower,
      nationalIdPassport,
      passwordHash
    );

    const token = generateToken({ id: newOwner.id, email: newOwner.business_email, role: "owner" });

    res.status(201).json({
      message: "Partner account registered successfully",
      owner: {
        id: newOwner.id,
        fullName: newOwner.full_name,
        businessEmail: newOwner.business_email,
        contactNumber: newOwner.contact_number,
        birthday: newOwner.birthday,
        nationalIdPassport: newOwner.national_id_passport,
      },
      token,
    });
  } catch (error) {
    console.error("Owner registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Business email and password are required" });
    }

    const emailLower = email.toLowerCase().trim();
    const owner = await ownerModel.findOwnerByEmail(emailLower);
    if (!owner) {
      return res.status(400).json({ error: "Invalid business email or password" });
    }

    const isMatch = verifyPassword(password, owner.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid business email or password" });
    }

    const token = generateToken({ id: owner.id, email: owner.business_email, role: "owner" });

    res.status(200).json({
      message: "Owner login successful",
      owner: {
        id: owner.id,
        fullName: owner.full_name,
        businessEmail: owner.business_email,
        contactNumber: owner.contact_number,
        birthday: owner.birthday,
        nationalIdPassport: owner.national_id_passport,
      },
      token,
    });
  } catch (error) {
    console.error("Owner login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = {
  register,
  login,
};
