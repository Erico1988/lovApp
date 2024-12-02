import pool from '../config';
import { User } from '../../types/types';

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, name, role, coordination, permissions, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user.email, user.name, user.role, user.coordination, user.permissions, user.password_hash]
    );
    return result.rows[0];
  },

  async updateLastLogin(userId: string): Promise<void> {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async updateStatus(userId: string, status: 'active' | 'inactive'): Promise<void> {
    await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2',
      [status, userId]
    );
  }
};