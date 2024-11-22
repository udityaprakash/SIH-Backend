const eventschema = require("../../databasevariables/eventschema");

const event = {
    createEvent: async (req,res)=>{
        const {eventName,eventDescription,location,eventDate,eventImageUrl,eventStartTime, eventEndTime, registration, pricing }=req.body;
        try{
            const newEvent = new eventschema({
                eventName,
                eventDescription,
                location,
                eventDate,
                eventImageUrl,
                eventStartTime,
                eventEndTime,
                registration:{
                    start:registration.start ? registration.start : Date.now(),
                    end:registration.end,
                    price:registration.price ? registration.price : 0
                },
                pricing,
            });
            await newEvent.save();
            res.json({
                success:true,
                msg:"event created successfully😍"
            });
        }catch(err){
            res.json({
                success:false,
                error:err,
                msg:"something went wrong 🤷‍♂️"
            });
        }
    },
    getEvents : async (req,res)=>{
        try{
                  const currentDate = new Date();
                  const page = parseInt(req.query.page) || 1;
                  const limit = parseInt(req.query.limit) || 9;
                  const skip = (page - 1) * limit;
              
                  const events = await eventschema.find({
                    eventDate: { $gt: currentDate }
                  })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select('eventImageUrl eventName eventDescription pricing registration eventDate eventStartTime eventEndTime location');
                    if (events.length === 0) {
                        return res.status(404).send("No upcoming events found.");
                    }
              
                  res.json({
                    success:true,
                    msg:"events fetched successfully 😍",
                    events: events.map(event => ({
                      eventImageUrl: event.eventImageUrl,
                      eventName: event.eventName,
                      eventDescription: event.eventDescription,
                      isFree: !event.pricing,
                      price: event.registration.price,
                      eventDate: event.eventDate,
                      eventStartTime: event.eventStartTime,
                      eventEndTime: event.eventEndTime,
                      location: event.location,
                      registration: {
                        start: event.registration.start,
                        end: event.registration.end
                      }
                    })),
                    currentPage: page,
                    totalEvents: await eventschema.countDocuments({ eventDate: { $gt: currentDate } }),
                    totalPages: Math.ceil(await eventschema.countDocuments({ eventDate: { $gt: currentDate } }) / limit)
                  });
              
        }catch(err){
            res.json({
                success:false,
                error:err,
                msg:"something went wrong 🤷‍♂️"
            });
        }
    },
}

module.exports = event;