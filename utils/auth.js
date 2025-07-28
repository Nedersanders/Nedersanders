const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Failed to compare passwords');
  }
}

/**
 * Generate a random password
 * @param {number} length - Length of the password (default: 12)
 * @returns {string} - Random password
 */
function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
function validatePassword(password) {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Wachtwoord moet minimaal 8 karakters lang zijn');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één hoofdletter bevatten');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één kleine letter bevatten');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één cijfer bevatten');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Wachtwoord moet minimaal één speciaal karakter bevatten');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  generatePassword,
  validatePassword,
  saltRounds
};
