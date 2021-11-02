'use strict';

const db = require('../utils/dbConnection');

module.exports.findSpeakerBySpeakerId = function findSpeakerBySpeakerId (req, res, next) {
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
  WHERE post_type="contact" AND post_status="publish" AND ID=? GROUP BY ID;`;

  if (req.speakerId.value && req.speakerId.value.match(/^[0-9]+$/)) {
    db.query(sql, [req.speakerId.value]).then((result) => {
      if (typeof result !== 'object') res.status(500).send({ error: 'Query returned invalid type value' });
      else if (result.length > 0) {
        const speaker = result[0];

        const urls = [speaker.LINKEDIN, speaker.TWITTER, speaker.FACEBOOK].filter((url) => url !== null);
        const rst = {
          speakerId: speaker.ID,
          speakerName: `${speaker.NAME} ${speaker.SURNAME}`,
          speakerDescription: speaker.DESCRIPTION
        };
        if (speaker.JOBTITLE) rst.speakerJobTitle = speaker.JOBTITLE;
        if (speaker.EMAIL !== null) rst.speakerEmail = speaker.EMAIL;
        if (urls.length > 0) rst.speakerUrls = urls;

        res.status(200).send(rst);
      } else {
        res.status(404).send({ message: 'Speaker not found' });
      }
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  } else {
    res.status(400).send({ message: 'Invalid speakerId' });
  }
};
