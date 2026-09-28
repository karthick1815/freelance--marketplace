-- Run this against your EXISTING freelance_marketplace database to add login support.
-- (If you're setting up the database fresh, this is already included in freelance_marketplace.sql instead.)

USE freelance_marketplace;

ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'UNSET';

-- Note: your original 30 seeded users (id 1-30) get a placeholder password value
-- ('UNSET') that cannot match any real login attempt, since it isn't a valid
-- BCrypt hash. They are effectively "locked out" until you register them properly
-- through the new /api/auth/register endpoint, or manually set a real BCrypt hash.
-- Any NEW user created via Register on the website will get a real, working password.
