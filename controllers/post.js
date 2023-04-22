import { db } from "../connect.js";

export const getPosts = (req, res) => {
  const q = `select p.*, u.id as userId, name, profilePic from posts as p join users as u on (u.id = p.userId)`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};
