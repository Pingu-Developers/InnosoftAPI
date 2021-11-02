'use strict';

const db = require('../utils/dbConnection');

module.exports.findPostByPostId = function findPostByPostId (req, res, next) {
  const sql = `SELECT p.ID,post_title,post_content,post_date,display_name FROM wp_posts p 
  RIGHT JOIN wp_users u ON post_author = u.ID WHERE post_type='post' AND post_status='publish' 
  AND p.ID=? ORDER BY p.post_date DESC;`;

  if (req.postId.value && req.postId.value.match(/^[0-9]+$/)) {
    db.query(sql, [req.postId.value]).then((result) => {
      if (result.length > 0) {
        let post = result[0];
        post = {
          postId: post.ID,
          postTitle: post.post_title,
          postContent: post.post_content,
          postDateTime: new Date(post.post_date).toISOString(),
          postAuthor: post.display_name
        };
        res.status(200).send(post);
      } else {
        res.status(404).send({ message: 'Post not found' });
      }
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  } else {
    res.status(400).send({ message: 'Invalid postId' });
  }
};
