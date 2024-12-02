import pool from '../config';
import { Task } from '../../types/types';

export const taskRepository = {
  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (
        market_id, title, description, status,
        priority, assigned_to, start_date, due_date,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        task.marketId,
        task.title,
        task.description,
        task.status,
        task.priority,
        task.assignedTo,
        task.startDate,
        task.dueDate,
        task.createdBy
      ]
    );
    return result.rows[0];
  },

  async findByMarket(marketId: string): Promise<Task[]> {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE market_id = $1 ORDER BY created_at ASC',
      [marketId]
    );
    return result.rows;
  },

  async update(taskId: string, updates: Partial<Task>): Promise<Task> {
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(updates);
    
    const result = await pool.query(
      `UPDATE tasks SET ${fields} WHERE id = $1 RETURNING *`,
      [taskId, ...values]
    );
    return result.rows[0];
  },

  async findById(taskId: string): Promise<Task | null> {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );
    return result.rows[0] || null;
  },

  async delete(taskId: string): Promise<void> {
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
  }
};