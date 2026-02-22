import { getDbHealth } from '../config/db.js';

export const getHealth = (_req, res) => {
  res.status(200).json({
    ok: true,
    db: getDbHealth(),
  });
};
