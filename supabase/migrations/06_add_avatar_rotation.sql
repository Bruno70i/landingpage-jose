-- Add avatar_rotation column to profiles table
ALTER TABLE profiles 
ADD COLUMN avatar_rotation INTEGER DEFAULT 0;
