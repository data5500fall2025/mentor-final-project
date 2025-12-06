const Event = require("../models/event-model");

exports.getEvents = async (req, res, next) => {
  try {
    // Fetch events sorted by date
    const events = await Event.find().sort({ date: 1 });

    // Format each event's date for display
    const formattedEvents = events.map(event => {
      const obj = event.toObject();

      return {
        ...obj,
        formattedDate: new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      };
    });

    return res.render("events", {
      pageTitle: "Events",
      pageClass: "events-page",
      events: formattedEvents,
    });

  } catch (err) {
    // Pass error to 500 handler
    return next(err);
  }
};
