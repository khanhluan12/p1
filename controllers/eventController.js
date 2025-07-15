const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

exports.showEvents = async (req, res) => {
  const events = await Event.find();
  const enhancedEvents = await Promise.all(events.map(async (event) => {
    const count = await Registration.countDocuments({ eventId: event._id });
    return { ...event.toObject(), registeredCount: count };
  }));
  res.render('registerEvent', { events: enhancedEvents, message: null });
};

exports.loadEventsWithCount = async () => {
  const events = await Event.find();
  return await Promise.all(events.map(async (event) => {
    const count = await Registration.countDocuments({ eventId: event._id });
    return { ...event.toObject(), registeredCount: count };
  }));
};
