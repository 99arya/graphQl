const Booking = require("../../models/booking");
const { transformBooking, transformEvent} = require("./merge");
const Event = require("../../models/event");



module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (e) {
      throw e;
    }
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5d6fcc7f6ca67c7bc3a7a00e",
      event: fetchedEvent
    });
    const result = await booking.save();
    console.log("B", result);
    return transformBooking(result);
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (e) {
      throw e;
    }
  }
};
