import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

const today = (): string => new Date().toISOString().split('T')[0];

interface QueryHandler {
  pattern: RegExp;
  handler: () => Promise<string>;
}

export const queryDatabase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question } = req.body;
    const answer = await processQuestion(question);
    res.json({ question, answer });
  } catch (error) {
    console.error('MCP query error:', error);
    res.status(500).json({ message: 'Server error processing query' });
  }
};

async function processQuestion(question: string): Promise<string> {
  const q = question.toLowerCase();
  const todayStr = today();

  if (q.includes('active') || q.includes('פעיל')) {
    const [result] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM vacations WHERE start_date <= ? AND end_date >= ?',
      [todayStr, todayStr]
    );
    const count = result[0].count;
    return `There are currently ${count} active vacation(s) (vacations that have started but not yet ended).`;
  }

  if (q.includes('average') || q.includes('ממוצע') || q.includes('price') || q.includes('מחיר')) {
    const [result] = await pool.execute<RowDataPacket[]>(
      'SELECT AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price FROM vacations'
    );
    const { avg_price, min_price, max_price } = result[0];
    return `Vacation price statistics:\n- Average price: $${parseFloat(avg_price).toFixed(2)}\n- Minimum price: $${parseFloat(min_price).toFixed(2)}\n- Maximum price: $${parseFloat(max_price).toFixed(2)}`;
  }

  if (q.includes('europe') || q.includes('אירופה') || q.includes('future') || q.includes('עתיד')) {
    const europeanCountries = [
      'france', 'italy', 'spain', 'uk', 'netherlands', 'czech', 'greece', 'iceland',
      'paris', 'rome', 'barcelona', 'london', 'amsterdam', 'prague', 'santorini', 'reykjavik',
    ];

    const [vacations] = await pool.execute<RowDataPacket[]>(
      'SELECT destination, start_date, end_date, price FROM vacations WHERE start_date > ? ORDER BY start_date ASC',
      [todayStr]
    );

    const europeanVacations = vacations.filter((v) =>
      europeanCountries.some((country) => v.destination.toLowerCase().includes(country))
    );

    if (europeanVacations.length === 0) {
      return 'No future vacations found for European destinations.';
    }

    const list = europeanVacations
      .map(
        (v) =>
          `- ${v.destination}: ${v.start_date} to ${v.end_date}, $${parseFloat(v.price).toFixed(2)}`
      )
      .join('\n');

    return `Future European vacations:\n${list}`;
  }

  if (q.includes('how many') || q.includes('כמה') || q.includes('total') || q.includes('count')) {
    const [result] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM vacations'
    );
    return `There are ${result[0].count} vacation(s) in total in the database.`;
  }

  if (q.includes('most liked') || q.includes('popular') || q.includes('likes') || q.includes('לייק')) {
    const [result] = await pool.execute<RowDataPacket[]>(`
      SELECT v.destination,
        (SELECT COUNT(*) FROM likes l WHERE l.vacation_id = v.id) as likes_count
      FROM vacations v
      ORDER BY likes_count DESC
      LIMIT 5
    `);

    const list = result
      .map((r, i) => `${i + 1}. ${r.destination}: ${r.likes_count} like(s)`)
      .join('\n');

    return `Top vacations by likes:\n${list}`;
  }

  if (q.includes('user') || q.includes('משתמש')) {
    const [result] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      ['user']
    );
    const [adminResult] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      ['admin']
    );
    return `User statistics:\n- Regular users: ${result[0].count}\n- Admins: ${adminResult[0].count}`;
  }

  if (q.includes('list') || q.includes('all vacation') || q.includes('show')) {
    const [vacations] = await pool.execute<RowDataPacket[]>(
      'SELECT destination, start_date, end_date, price FROM vacations ORDER BY start_date ASC'
    );

    const list = vacations
      .map(
        (v) =>
          `- ${v.destination}: ${v.start_date} to ${v.end_date}, $${parseFloat(v.price).toFixed(2)}`
      )
      .join('\n');

    return `All vacations:\n${list}`;
  }

  return `I can answer questions about the vacation database. Try asking:
- "How many active vacations are there?"
- "What is the average price of vacations?"
- "What future European vacations are available?"
- "How many vacations are in total?"
- "What are the most liked vacations?"
- "List all vacations"`;
}

export const getMcpTools = () => [
  {
    name: 'query_vacations_db',
    description: 'Query the vacations database to answer questions about vacations, likes, prices, and users',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'A natural language question about the database',
        },
      },
      required: ['question'],
    },
  },
];

export const handleMcpToolCall = async (question: string): Promise<string> => {
  return processQuestion(question);
};
