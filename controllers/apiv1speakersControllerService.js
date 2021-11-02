'use strict';

const db = require('../utils/dbConnection');

module.exports.getSpeakers = function getSpeakers (req, res, next) {
  const sql = `SELECT 
      ID,
      MAX(CASE WHEN meta_key='_cl_first_name' THEN meta_value END) AS NAME,
      MAX(CASE WHEN meta_key='_cl_last_name' THEN meta_value ELSE '' END) AS SURNAME,
      MAX(CASE WHEN meta_key='_cl_job_title' THEN meta_value END) AS JOBTITLE,
      MAX(CASE WHEN meta_key='_cl_custom_field_1' THEN meta_value END) AS DESCRIPTION,
      MAX(CASE WHEN meta_key='_cl_email' THEN meta_value END) AS EMAIL,
      MAX(CASE WHEN meta_key='_cl_linkedin_url' THEN meta_value END) AS LINKEDIN,
      MAX(CASE WHEN meta_key='_cl_twitter_url' THEN meta_value END) AS TWITTER,
      MAX(CASE WHEN meta_key='_cl_facebook_url' THEN meta_value END) AS FACEBOOK
  FROM wp_posts RIGHT JOIN wp_postmeta ON ID=post_id 
  WHERE post_type="contact" AND post_status="publish" GROUP BY ID;`;

  db.query(sql).then((result) => {
    const speakers = result.map((item) => {
      const urls = [item.LINKEDIN, item.TWITTER, item.FACEBOOK].filter((url) => url !== null);
      const rst = {
        speakerId: item.ID,
        speakerName: `${item.NAME} ${item.SURNAME}`,
        speakerDescription: item.DESCRIPTION
      };
      if (item.JOBTITLE) rst.speakerJobTitle = item.JOBTITLE;
      if (item.EMAIL !== null) rst.speakerEmail = item.EMAIL;
      if (urls.length > 0) rst.speakerUrls = urls;
      return rst;
    });
    res.status(200).send(speakers);
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};
