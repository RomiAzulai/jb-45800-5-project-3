import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { VacationFilter } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const today = (): string => new Date().toISOString().split('T')[0];

const buildFilterClause = (
  filter: VacationFilter,
  userId: number
): { clause: string; params: (string | number)[] } => {
  const todayStr = today();

  switch (filter) {
    case 'liked':
      return {
        clause: `AND v.id IN (SELECT vacation_id FROM likes WHERE user_id = ?)`,
        params: [userId],
      };
    case 'active':
      return {
        clause: `AND v.start_date <= ? AND v.end_date >= ?`,
        params: [todayStr, todayStr],
      };
    case 'future':
      return {
        clause: `AND v.start_date > ?`,
        params: [todayStr],
      };
    default:
      return { clause: '', params: [] };
  }
};

export const getVacations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const filter = (req.query.filter as VacationFilter) || 'all';

    const { clause, params } = buildFilterClause(filter, userId);

    const countQuery = `SELECT COUNT(*) as total FROM vacations v WHERE 1=1 ${clause}`;
    const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, params);
    const total = countResult[0].total;

    const query = `
      SELECT v.*,
        (SELECT COUNT(*) FROM likes l WHERE l.vacation_id = v.id) as likes_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.vacation_id = v.id AND l.user_id = ?) as is_liked
      FROM vacations v
      WHERE 1=1 ${clause}
      ORDER BY v.start_date ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [vacations] = await pool.execute<RowDataPacket[]>(query, [
      userId,
      ...params,
    ]);

    res.json({
      vacations: vacations.map((v) => ({
        id: v.id,
        destination: v.destination,
        description: v.description,
        startDate: v.start_date,
        endDate: v.end_date,
        price: parseFloat(v.price),
        imageFilename: v.image_filename,
        likesCount: v.likes_count,
        isLiked: Boolean(v.is_liked),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get vacations error:', error);
    res.status(500).json({ message: 'Server error fetching vacations' });
  }
};

export const getVacationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [vacations] = await pool.execute<RowDataPacket[]>(
      `SELECT v.*,
        (SELECT COUNT(*) FROM likes l WHERE l.vacation_id = v.id) as likes_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.vacation_id = v.id AND l.user_id = ?) as is_liked
      FROM vacations v WHERE v.id = ?`,
      [userId, id]
    );

    if (vacations.length === 0) {
      res.status(404).json({ message: 'Vacation not found' });
      return;
    }

    const v = vacations[0];
    res.json({
      id: v.id,
      destination: v.destination,
      description: v.description,
      startDate: v.start_date,
      endDate: v.end_date,
      price: parseFloat(v.price),
      imageFilename: v.image_filename,
      likesCount: v.likes_count,
      isLiked: Boolean(v.is_liked),
    });
  } catch (error) {
    console.error('Get vacation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createVacation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, description, startDate, endDate, price } = req.body;
    const imageFilename = req.file?.filename;
    const priceNum = parseFloat(price);

    if (!destination || !description || !startDate || !endDate || !price) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (isNaN(priceNum) || priceNum < 0 || priceNum > 10000) {
      res.status(400).json({ message: 'Price must be between 0 and 10,000' });
      return;
    }

    if (!imageFilename) {
      res.status(400).json({ message: 'Image is required' });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      res.status(400).json({ message: 'End date cannot be before start date' });
      return;
    }

    const todayStr = today();
    if (new Date(startDate) < new Date(todayStr) || new Date(endDate) < new Date(todayStr)) {
      res.status(400).json({ message: 'Cannot use past dates' });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?, ?)',
      [destination, description, startDate, endDate, priceNum, imageFilename]
    );

    res.status(201).json({
      message: 'Vacation created successfully',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Create vacation error:', error);
    res.status(500).json({ message: 'Server error creating vacation' });
  }
};

export const updateVacation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { destination, description, startDate, endDate, price } = req.body;
    const priceNum = parseFloat(price);

    if (!destination || !description || !startDate || !endDate || !price) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (isNaN(priceNum) || priceNum < 0 || priceNum > 10000) {
      res.status(400).json({ message: 'Price must be between 0 and 10,000' });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      res.status(400).json({ message: 'End date cannot be before start date' });
      return;
    }

    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM vacations WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: 'Vacation not found' });
      return;
    }

    let imageFilename = existing[0].image_filename;
    if (req.file) {
      imageFilename = req.file.filename;
    }

    await pool.execute(
      'UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_filename = ? WHERE id = ?',
      [destination, description, startDate, endDate, priceNum, imageFilename, id]
    );

    res.json({ message: 'Vacation updated successfully' });
  } catch (error) {
    console.error('Update vacation error:', error);
    res.status(500).json({ message: 'Server error updating vacation' });
  }
};

export const deleteVacation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM vacations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Vacation not found' });
      return;
    }

    res.json({ message: 'Vacation deleted successfully' });
  } catch (error) {
    console.error('Delete vacation error:', error);
    res.status(500).json({ message: 'Server error deleting vacation' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (req.user!.role === 'admin') {
      res.status(403).json({ message: 'Admins cannot like vacations' });
      return;
    }

    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM likes WHERE user_id = ? AND vacation_id = ?',
      [userId, id]
    );

    if (existing.length > 0) {
      await pool.execute('DELETE FROM likes WHERE user_id = ? AND vacation_id = ?', [userId, id]);
      res.json({ message: 'Like removed', isLiked: false });
    } else {
      await pool.execute('INSERT INTO likes (user_id, vacation_id) VALUES (?, ?)', [userId, id]);
      res.json({ message: 'Vacation liked', isLiked: true });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [report] = await pool.execute<RowDataPacket[]>(`
      SELECT v.destination,
        (SELECT COUNT(*) FROM likes l WHERE l.vacation_id = v.id) as likes_count
      FROM vacations v
      ORDER BY likes_count DESC
    `);

    res.json(
      report.map((r) => ({
        destination: r.destination,
        likesCount: r.likes_count,
      }))
    );
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error fetching report' });
  }
};

export const downloadCsv = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [report] = await pool.execute<RowDataPacket[]>(`
      SELECT v.destination,
        (SELECT COUNT(*) FROM likes l WHERE l.vacation_id = v.id) as likes_count
      FROM vacations v
      ORDER BY likes_count DESC
    `);

    const csvHeader = 'Destination,Likes\n';
    const csvRows = report
      .map((r) => `"${r.destination}",${r.likes_count}`)
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=vacations-report.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    console.error('Download CSV error:', error);
    res.status(500).json({ message: 'Server error generating CSV' });
  }
};
