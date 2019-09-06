const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const { user } = require("./merge");
const User = require("../../models/user");

const { transformEvent} = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  createEvent: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated!')
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();

      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User does not exist");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
};
