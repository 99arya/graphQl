const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString} = require('../../helpers/date')



const events = async eventIds => {
    try {
      const events = await Event.find({ _id: { $in: eventIds } });
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  
  const singleEvent = async eventId => {
    try {
      const event = await Event.findById(eventId);
      return transformEvent(event);
    } catch (e) {
      throw e;
    }
  };
  
  const user = async userId => {
    try {
      const user = await User.findById(userId);
      // console.log(user)
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const transformEvent = event => {
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event._doc.creator),
      date: dateToString(event._doc.date)
    };
  };

  const transformBooking = booking => {
    return {
      ...booking._doc,
      _id: booking.id,
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt),
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event)
    };
  };

  // exports.user = user;
  // exports.events = events;
  // exports.singleEvent = singleEvent;

  exports.transformEvent = transformEvent;
  exports.transformBooking = transformBooking;