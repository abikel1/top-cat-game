import { pool } from '../db/pool.js';

export async function createUser({ name, image_url, score = 0 }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, image_url, score)
     VALUES ($1, $2, $3)
     RETURNING id, name, image_url, score`,
    [name, image_url, score]
  );
  return rows[0];
}

export async function updateUserScore({ id, score, delta }) {
  const query = (typeof score === 'number')
    ? `UPDATE users
       SET score = $1
       WHERE id = $2
       RETURNING id, name, image_url, score`
    : `UPDATE users
       SET score = score + $1
       WHERE id = $2
       RETURNING id, name, image_url, score`;

  const params = (typeof score === 'number') ? [score, id] : [delta ?? 0, id];

  const { rows } = await pool.query(query, params);
  return rows[0] || null; 
}

export async function getTopN(limit = 10) {
  const { rows } = await pool.query(
    `SELECT id, name, image_url, score
     FROM users
     ORDER BY score DESC, id ASC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function getAroundUser(userId, windowSize = 5) {
  const rankRes = await pool.query(
    `SELECT rk AS rank
     FROM (
       SELECT id, RANK() OVER (ORDER BY score DESC, id ASC) AS rk
       FROM users
     ) r
     WHERE r.id = $1`,
    [userId]
  );
  if (!rankRes.rows.length) return null;

  const rank = Number(rankRes.rows[0].rank);
  const minRank = Math.max(rank - windowSize, 1);
  const maxRank = rank + windowSize;

  const aroundRes = await pool.query(
    `SELECT id, name, image_url, score, rk AS rank
     FROM (
       SELECT id, name, image_url, score,
              RANK() OVER (ORDER BY score DESC, id ASC) AS rk
       FROM users
     ) t
     WHERE rk BETWEEN $1 AND $2
     ORDER BY rk ASC`,
    [minRank, maxRank]
  );

  return { rank, window: aroundRes.rows };
}

export async function getBottomN(limit = 3) {
  const { rows } = await pool.query(
    `SELECT id, name, image_url, score
     FROM users
     ORDER BY score ASC, id DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}
