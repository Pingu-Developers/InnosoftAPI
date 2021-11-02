'use strict';

const db = require('../utils/dbConnection');

module.exports.getEvents = function getEvents (req, res, next) {
  const sql = `SELECT posts.ID,post_title,start,end,time_start,time_end 
    FROM wp_posts posts RIGHT JOIN wp_mec_events ev on posts.ID = ev.post_id 
    WHERE post_type = 'mec-events' and post_status not like 'auto-draft';`;

  db.query(sql).then((result) => {
    const events = result.map((item) => {
      const start = item.start === '0000-00-00' ? new Date() : new Date(`${item.start}`);
      const end = item.end === '0000-00-00' ? new Date(`${item.start}`) : new Date(`${item.end}`);
      start.setSeconds(item.time_start);
      end.setSeconds(item.time_end);

      return {
        eventId: item.ID,
        eventName: item.post_title,
        eventStartDateTime: start.toISOString(),
        eventEndDateTime: end.toISOString()
      };
    });
    res.status(200).send(events);
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};
