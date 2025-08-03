-- Migration to add change_password_token and profile_image_url fields to users table
-- Run this migration if these fields don't already exist in your users table

-- Add change_password_token field
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS change_password_token VARCHAR(64) UNIQUE;

-- Add profile_image_url field
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Add index on change_password_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_change_password_token 
ON users(change_password_token) 
WHERE change_password_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.change_password_token IS 'Temporary token for password reset functionality';
COMMENT ON COLUMN users.profile_image_url IS 'URL to user profile image';
