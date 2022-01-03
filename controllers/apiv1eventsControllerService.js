'use strict';

const db = require('../utils/dbConnection');

module.exports.getEvents = function getEvents (req, res, next) {
  const sql = `SELECT ID,post_title,
      MAX(CASE WHEN meta_key='mec_start_date' THEN meta_value END) AS start,
      MAX(CASE WHEN meta_key='mec_end_date' THEN meta_value END) AS end,
      MAX(CASE WHEN meta_key='mec_start_day_seconds' THEN meta_value END) AS time_start,
      MAX(CASE WHEN meta_key='mec_end_day_seconds' THEN meta_value END) AS time_end,
      MAX(CASE WHEN meta_key='mec_organizer_id' THEN (SELECT name FROM wp_terms WHERE term_id=meta_value) END) AS organizer,
      MAX(CASE WHEN meta_key='mec_location_id' THEN (SELECT name FROM wp_terms WHERE term_id=meta_value) END) AS location
    FROM wp_posts
    RIGHT JOIN wp_postmeta ON ID=post_id
    WHERE post_type = 'mec-events' and post_status not like 'auto-draft'
    GROUP BY ID;`;

  db.query(sql).then((result) => {
    const events = result.filter((item) => item.start && item.time_start && item.end && item.time_end).map((item) => {
      const start = new Date(`${item.start}`);
      const end = new Date(`${item.end}`);
      start.setSeconds(item.time_start);
      end.setSeconds(item.time_end);

      const response = {
        eventId: item.ID,
        eventName: item.post_title,
        eventStartDateTime: start.toISOString(),
        eventEndDateTime: end.toISOString()
      };
      if (item.organizer && !item.organizer.match(/Sin categor.*/)) response.eventOrganizer = item.organizer;
      if (item.location && !item.location.match(/Sin categor.*/)) response.eventLocation = item.location;
      return response;
    });
    events.sort((a, b) => a.eventStartDateTime > b.eventStartDateTime ? 1 : b.eventEndDateTime > a.eventEndDateTime ? -1 : a.eventId > b.eventId ? 1 : -1);
    res.status(200).send(events);
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};
