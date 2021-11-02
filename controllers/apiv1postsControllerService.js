'use strict';

const db = require('../utils/dbConnection');

module.exports.getPosts = function getPosts (req, res, next) {
  const sql = `SELECT p.ID,post_title,post_content,post_date,display_name FROM wp_posts p 
  RIGHT JOIN wp_users u ON post_author = u.ID WHERE post_type='post' AND post_status='publish' 
  ORDER BY p.post_date DESC;`; 
  
  db.query(sql).then((result) => {
    const posts = result.map((item) => {
      return {
        postId: item.ID,
        postTitle: item.post_title,
        postContent: item.post_content,
        postDateTime: new Date(item.post_date).toISOString(),
        postAuthor: item.display_name
      };
    });
    res.status(200).send(posts);
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};
