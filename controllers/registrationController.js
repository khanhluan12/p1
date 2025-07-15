const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');
const User = require('../models/userModel');
exports.showEvents = async (req, res) => {
  const events = await Event.find();
  const enhancedEvents = await Promise.all(events.map(async (event) => {
    const count = await Registration.countDocuments({ eventId: event._id });
    return { ...event.toObject(), registeredCount: count };
  }));
  res.render('registerEvent', { events: enhancedEvents ,message: null});
};

exports.registerEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const studentId = req.user.id;

  const event = await Event.findById(eventId);
  const count = await Registration.countDocuments({ eventId });

  if (count >= event.capacity) {
    const events = await loadEventsWithCount();
    return res.render('registerEvent', { events, message: 'Event is full' });
  }

  const alreadyRegistered = await Registration.findOne({ studentId, eventId });
  if (alreadyRegistered) {
    const events = await loadEventsWithCount();
    return res.render('registerEvent', { events, message: 'You already registered for this event' });
  }

  await Registration.create({ studentId, eventId });
  const events = await loadEventsWithCount();
  res.render('registerEvent', { events, message: 'Successfully registered!' });
};

const loadEventsWithCount = async () => {
  const events = await Event.find();
  return await Promise.all(events.map(async (event) => {
    const count = await Registration.countDocuments({ eventId: event._id });
    return { ...event.toObject(), registeredCount: count };
  }));
};


exports.listAllRegistrations = async (req, res) => {
  const registrations = await Registration.find()
    .populate('studentId', 'username')  
    .populate('eventId', 'title')       
    .sort({ registrationDate: -1 });

  const formatted = registrations.map(r => ({
    student: r.studentId,
    event: r.eventId,
    registrationDate: r.registrationDate
  }));

  res.render('listRegistrations', { registrations: formatted });
};
