'use strict';

const db = require('../utils/dbConnection');

module.exports.findEventByEventId = function findEventByEventId (req, res, next) {
  const sql = `SELECT posts.ID,post_title,start,end,time_start,time_end 
    FROM wp_posts posts RIGHT JOIN wp_mec_events ev on posts.ID = ev.post_id 
    WHERE post_type = 'mec-events' and post_status not like 'auto-draft' and posts.ID=?;`;

  if (req.eventId.value && req.eventId.value.match(/^[0-9]+$/)) {
    db.query(sql, [req.eventId.value]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({ message: 'Event not found' });
      } else {
        let event = result[0];
        const start = event.start === '0000-00-00' ? new Date() : new Date(`${event.start}`);
        const end = event.end === '0000-00-00' ? new Date(`${event.start}`) : new Date(`${event.end}`);
        start.setSeconds(event.time_start);
        end.setSeconds(event.time_end);

        event = {
          eventId: event.ID,
          eventName: event.post_title,
          eventStartDateTime: start.toISOString(),
          eventEndDateTime: end.toISOString()
        };

        res.status(200).send(event);
      }
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  } else {
    res.status(400).send({ message: 'Invalid eventId' });
  }
};
