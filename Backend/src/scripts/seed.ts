import bcrypt from 'bcrypt';
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await pool.execute('DELETE FROM likes');
    await pool.execute('DELETE FROM vacations');
    await pool.execute('DELETE FROM users');

    await pool.execute<ResultSetHeader>(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', 'User', 'admin@vacations.com', hashedPassword, 'admin']
    );

    await pool.execute<ResultSetHeader>(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
      [
        'John', 'Doe', 'john@example.com', userPassword, 'user',
        'Jane', 'Smith', 'jane@example.com', userPassword, 'user',
      ]
    );

    const vacations = [
      ['Paris, France', 'Experience the City of Light with guided tours of the Eiffel Tower, Louvre Museum, and charming Montmartre district.', '2026-08-01', '2026-08-10', 2499.00, 'paris.jpg'],
      ['Rome, Italy', 'Explore ancient history with visits to the Colosseum, Vatican City, and Roman Forum.', '2026-07-15', '2026-07-25', 2199.00, 'rome.jpg'],
      ['Barcelona, Spain', 'Discover Gaudi architecture including Sagrada Familia and Park Guell.', '2026-09-01', '2026-09-12', 1899.00, 'barcelona.jpg'],
      ['Tokyo, Japan', 'Immerse yourself in Japanese culture with visits to Senso-ji Temple and Mount Fuji.', '2026-10-05', '2026-10-18', 3499.00, 'tokyo.jpg'],
      ['New York, USA', 'Broadway shows, Central Park, Statue of Liberty, and world-class shopping.', '2026-11-20', '2026-11-30', 2799.00, 'newyork.jpg'],
      ['London, UK', 'Royal London experience with Buckingham Palace and Tower of London.', '2026-06-10', '2026-06-20', 2299.00, 'london.jpg'],
      ['Amsterdam, Netherlands', 'Canal cruises, Van Gogh Museum, and cycling through Dutch countryside.', '2026-05-15', '2026-05-25', 1699.00, 'amsterdam.jpg'],
      ['Dubai, UAE', 'Luxury desert safari, Burj Khalifa, and world-class shopping.', '2026-12-01', '2026-12-10', 2999.00, 'dubai.jpg'],
      ['Bali, Indonesia', 'Tropical paradise with rice terraces and relaxing beach resorts.', '2026-08-20', '2026-09-05', 1999.00, 'bali.jpg'],
      ['Sydney, Australia', 'Opera House tour, Bondi Beach, and Blue Mountains day trip.', '2026-01-10', '2026-01-25', 3199.00, 'sydney.jpg'],
      ['Prague, Czech Republic', 'Medieval charm with Prague Castle and Charles Bridge.', '2026-04-01', '2026-04-10', 1299.00, 'prague.jpg'],
      ['Santorini, Greece', 'Stunning sunsets in Oia and volcanic beaches.', '2026-07-01', '2026-07-12', 2399.00, 'santorini.jpg'],
      ['Cancun, Mexico', 'Caribbean beaches and Mayan ruins at Chichen Itza.', '2026-03-15', '2026-03-28', 1799.00, 'cancun.jpg'],
      ['Reykjavik, Iceland', 'Northern Lights hunting and Blue Lagoon spa.', '2026-02-01', '2026-02-12', 2899.00, 'iceland.jpg'],
    ];

    for (const v of vacations) {
      await pool.execute(
        'INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?, ?)',
        v
      );
    }

    await pool.execute('INSERT INTO likes (user_id, vacation_id) VALUES (2, 1), (2, 3), (2, 5), (3, 1), (3, 2), (3, 4), (3, 7)');

    console.log('Database seeded successfully!');
    console.log('Admin: admin@vacations.com / admin123');
    console.log('User: john@example.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
