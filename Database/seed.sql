-- Seed data for Vacations Management System
-- Run after schema.sql

USE vacations_db;

-- Clear existing data (except we'll re-insert)
DELETE FROM likes;
DELETE FROM vacations;
DELETE FROM users;

-- Users (passwords: admin123 / user123 - hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('Admin', 'User', 'admin@vacations.com', '$2b$10$nnaZ24DhHcS0HiUqwjRlHOrij7ZFPmMG.tAzhPLbGYpuwcGsGajH.', 'admin'),
('John', 'Doe', 'john@example.com', '$2b$10$CmVxYi.hGIBvLRleIgteCOj4OczY/pgtQOMVtba4QOfZGdV6oMy8i', 'user'),
('Jane', 'Smith', 'jane@example.com', '$2b$10$CmVxYi.hGIBvLRleIgteCOj4OczY/pgtQOMVtba4QOfZGdV6oMy8i', 'user');

-- 12+ Vacations with real destinations
INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES
('Paris, France', 'Experience the City of Light with guided tours of the Eiffel Tower, Louvre Museum, and charming Montmartre district. Includes Seine river cruise and French cuisine tasting.', '2026-08-01', '2026-08-10', 2499.00, 'paris.jpg'),
('Rome, Italy', 'Explore ancient history with visits to the Colosseum, Vatican City, and Roman Forum. Enjoy authentic Italian pasta and gelato in Trastevere.', '2026-07-15', '2026-07-25', 2199.00, 'rome.jpg'),
('Barcelona, Spain', 'Discover Gaudi architecture including Sagrada Familia and Park Guell. Enjoy tapas, flamenco shows, and beautiful Mediterranean beaches.', '2026-09-01', '2026-09-12', 1899.00, 'barcelona.jpg'),
('Tokyo, Japan', 'Immerse yourself in Japanese culture with visits to Senso-ji Temple, Shibuya Crossing, and Mount Fuji day trip. Includes sushi-making class.', '2026-10-05', '2026-10-18', 3499.00, 'tokyo.jpg'),
('New York, USA', 'The city that never sleeps! Broadway shows, Central Park, Statue of Liberty, and world-class shopping on Fifth Avenue.', '2026-11-20', '2026-11-30', 2799.00, 'newyork.jpg'),
('London, UK', 'Royal London experience with Buckingham Palace, Tower of London, British Museum, and traditional afternoon tea.', '2026-06-10', '2026-06-20', 2299.00, 'london.jpg'),
('Amsterdam, Netherlands', 'Canal cruises, Van Gogh Museum, Anne Frank House, and cycling through picturesque Dutch countryside.', '2026-05-15', '2026-05-25', 1699.00, 'amsterdam.jpg'),
('Dubai, UAE', 'Luxury desert safari, Burj Khalifa observation deck, Palm Jumeirah, and world-class shopping at Dubai Mall.', '2026-12-01', '2026-12-10', 2999.00, 'dubai.jpg'),
('Bali, Indonesia', 'Tropical paradise with rice terraces, Ubud monkey forest, temple visits, and relaxing beach resorts.', '2026-08-20', '2026-09-05', 1999.00, 'bali.jpg'),
('Sydney, Australia', 'Opera House tour, Bondi Beach, Blue Mountains day trip, and harbor bridge climb experience.', '2026-01-10', '2026-01-25', 3199.00, 'sydney.jpg'),
('Prague, Czech Republic', 'Medieval charm with Prague Castle, Charles Bridge, Old Town Square, and traditional Czech beer tasting.', '2026-04-01', '2026-04-10', 1299.00, 'prague.jpg'),
('Santorini, Greece', 'Stunning sunsets in Oia, volcanic beaches, wine tasting, and exploring ancient Akrotiri ruins.', '2026-07-01', '2026-07-12', 2399.00, 'santorini.jpg'),
('Cancun, Mexico', 'Caribbean beaches, Mayan ruins at Chichen Itza, snorkeling in cenotes, and vibrant nightlife.', '2026-03-15', '2026-03-28', 1799.00, 'cancun.jpg'),
('Reykjavik, Iceland', 'Northern Lights hunting, Blue Lagoon spa, Golden Circle tour, and glacier hiking adventure.', '2026-02-01', '2026-02-12', 2899.00, 'iceland.jpg');

-- Sample likes
INSERT INTO likes (user_id, vacation_id) VALUES
(2, 1), (2, 3), (2, 5),
(3, 1), (3, 2), (3, 4), (3, 7);
