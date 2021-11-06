'use strict';

const db = require('../utils/dbConnection');

module.exports.findEventByEventId = function findEventByEventId (req, res, next) {
  const sql = `SELECT ID,post_title,
      MAX(CASE WHEN meta_key='mec_start_date' THEN meta_value END) AS start,
      MAX(CASE WHEN meta_key='mec_end_date' THEN meta_value END) AS end,
      MAX(CASE WHEN meta_key='mec_start_day_seconds' THEN meta_value END) AS time_start,
      MAX(CASE WHEN meta_key='mec_end_day_seconds' THEN meta_value END) AS time_end,
      MAX(CASE WHEN meta_key='mec_organizer_id' THEN (SELECT name FROM wp_terms WHERE term_id=meta_value) END) AS organizer,
      MAX(CASE WHEN meta_key='mec_location_id' THEN (SELECT name FROM wp_terms WHERE term_id=meta_value) END) AS location
    FROM wp_posts
    RIGHT JOIN wp_postmeta ON ID=post_id
    WHERE post_type = 'mec-events' and post_status not like 'auto-draft' and ID=?
    GROUP BY ID;`;

  if (req.eventId.value && req.eventId.value.match(/^[0-9]+$/)) {
    db.query(sql, [req.eventId.value]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({ message: 'Event not found' });
      } else if (!result[0].start || !result[0].time_start || !result[0].end || !result[0].time_end) {
        res.status(406).send({ message: 'Event has invalid fields' });
      } else {
        const event = result[0];
        const start = new Date(`${event.start}`);
        const end = new Date(`${event.end}`);
        start.setSeconds(event.time_start);
        end.setSeconds(event.time_end);

        const response = {
          eventId: event.ID,
          eventName: event.post_title,
          eventStartDateTime: start.toISOString(),
          eventEndDateTime: end.toISOString()
        };
        if (event.organizer && !event.organizer.match(/Sin categor.*/)) response.eventOrganizer = event.organizer;
        if (event.location && !event.location.match(/Sin categor.*/)) response.eventLocation = event.location;

        res.status(200).send(response);
      }
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  } else {
    res.status(400).send({ message: 'Invalid eventId' });
  }
};
