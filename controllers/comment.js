import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `select c.*, u.id as userId, name, profilePic from comments as c join users as u on (u.id = c.userId) where c.postId = ? order by c.createdAt desc`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err)
      return res.status(403).json("Token is not valid!");

    const q =
      "insert into comments(`desc`, `createdAt`, `userId`, `postId`) values (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res
        .status(200)
        .json("Comment has been created");
    });
  });
};
