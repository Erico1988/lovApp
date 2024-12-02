import pool from '../config';
import { Market } from '../../types/types';

export const marketRepository = {
  async create(market: Omit<Market, 'id'>): Promise<Market> {
    const result = await pool.query(
      `INSERT INTO markets (
        market_ref, market_type, coordination, description,
        status, budget_prev, budget_lines, ptba_date, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        market.marketRef,
        market.marketType,
        market.coordination,
        market.description,
        market.status,
        market.budgetPrev,
        market.budgetLines,
        market.ptbaDate,
        market.createdBy
      ]
    );
    return result.rows[0];
  },

  async findByRef(marketRef: string): Promise<Market | null> {
    const result = await pool.query(
      'SELECT * FROM markets WHERE market_ref = $1',
      [marketRef]
    );
    return result.rows[0] || null;
  },

  async update(marketRef: string, updates: Partial<Market>): Promise<Market> {
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(updates);
    
    const result = await pool.query(
      `UPDATE markets SET ${fields} WHERE market_ref = $1 RETURNING *`,
      [marketRef, ...values]
    );
    return result.rows[0];
  },

  async findAll(filters?: Partial<Market>): Promise<Market[]> {
    let query = 'SELECT * FROM markets';
    const values: any[] = [];
    
    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.entries(filters)
        .map(([key, value], index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${conditions}`;
      values.push(...Object.values(filters));
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, values);
    return result.rows;
  }
};