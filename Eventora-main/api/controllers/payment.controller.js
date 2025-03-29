import Stripe from 'stripe';
import User from '../models/user.model.js';  // Import the User model
import Post from '../models/post.model.js';  // Import the Post model to access event details
import { errorHandler } from '../utils/error.js'; // Optional: Import error handler

// Initialize Stripe with the secret key
const stripe = new Stripe("sk_test_51P69pRSEGGdpdixWa78KIgNdQvSx6ZFOAnliWjXQyWPrkKWFd7tLCPGoqjIMF7PwuPAzP9WQQExcXnaEV1OrHUrZ00AgOKhE0a"); 


export const createCheckoutSession = async (req, res, next) => {
    const { eventId, subEventId, eventName, eventPrice, email } = req.body;
    const userId = req.user.id; // Get user ID from token
    //console.log(userId);

    if(!userId){
        return next(errorHandler(401, 'Unauthorized access'));
    }
    
    try {
        const event = await Post.findById(eventId);
        if (!event) {
            return next(errorHandler(404, 'Event not found'));
        }

        const subEvent = event.subEvents.find(sub => sub._id.toString() === subEventId);
       // console.log(subEvent);
        
        if (!subEvent) {
            return next(errorHandler(404, 'Sub-event not found'));
        }

        // Add user ID to the participants array of the subEvent
        subEvent.participants.push({ userId: userId });
        await event.save();

        // Continue Stripe session logic...
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: subEvent.eventName,
                    },
                    unit_amount: subEvent.eventPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:5173/participations',
            cancel_url: 'http://localhost:5173/cancel',
            customer_email: email,
        });

        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        let participation = user.participations.find(part => part.mainEventId.toString() === eventId);
        if (!participation) {
            participation = {
                mainEventId: eventId,
                subEvents: [{
                    subEventId: subEventId,
                    eventName: subEvent.eventName,
                    eventPrice: subEvent.eventPrice,
                }],
            };
            user.participations.push(participation);
        } else {
            participation.subEvents.push({
                subEventId: subEventId,
                eventName: eventName,
                eventPrice: eventPrice,
            });
        }

        await user.save();

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating checkout session');
    }
};


// export const createCheckoutSession = async (req, res, next) => {
//     const { eventId, subEventId, email } = req.body;
//     const userId = req.user.id; // Get user ID from token (assuming verifyToken middleware is used)

//    // console.log(userId);
    

//     try {
//         // Fetch event and sub-event details
//         const event = await Post.findById(eventId);
//         if (!event) {
//             return next(errorHandler(404, 'Event not found'));
//         }

//         const subEvent = event.subEvents.find(sub => sub._id.toString() === subEventId);
//         if (!subEvent) {
//             return next(errorHandler(404, 'Sub-event not found'));
//         }

//         // Create Stripe session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: subEvent.eventName,  // Set sub-event name as the product name
//                         },
//                         unit_amount: subEvent.eventPrice * 100, // Set sub-event price in cents
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             success_url: 'http://localhost:5173/participations', // Frontend URL
//             cancel_url: 'http://localhost:5173/cancel',   // Frontend URL
//             customer_email: email,                         // Optional: set customer email
//         });

//         // Add event participation to the user's model after successful payment
//         const user = await User.findById(userId);
//         if (!user) {
//             return next(errorHandler(404, 'User not found'));
//         }

//         // Check if the user already has the main event in their participation list
//         let participation = user.participations.find(part => part.mainEventId.toString() === eventId);

//         if (!participation) {
//             // If not, create a new participation entry for the main event and sub-event
//             participation = {
//                 mainEventId: event._id,
//                 subEvents: [{
//                     subEventId: subEvent._id,
//                     eventName: subEvent.eventName,
//                     eventPrice: subEvent.eventPrice,
//                 }],
//             };
//             user.participations.push(participation);  // Push the new participation entry
//         } else {
//             // If the main event exists, add the sub-event to the subEvents array
//             participation.subEvents.push({
//                 subEventId: subEvent._id,
//                 eventName: subEvent.eventName,
//                 eventPrice: subEvent.eventPrice,
//             });
//         }

//         await user.save(); // Save the updated user document

//         // Send only the session ID to the frontend
//         res.json({ sessionId: session.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error creating checkout session');
//     }
// };




// import Stripe from 'stripe';
// //console.log(process.env.STRIPE_SECRET_KEY);

// const stripe = new Stripe("sk_test_51P69pRSEGGdpdixWa78KIgNdQvSx6ZFOAnliWjXQyWPrkKWFd7tLCPGoqjIMF7PwuPAzP9WQQExcXnaEV1OrHUrZ00AgOKhE0a"); // Initialize Stripe with the secret key

// export const createCheckoutSession = async (req, res) => {
//     const { eventName, eventPrice, email } = req.body;

//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: eventName,
//                         },
//                         unit_amount: eventPrice * 100, // Convert to cents
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             success_url: 'http://localhost:5173/success', // Frontend URL
//             cancel_url: 'http://localhost:5173/cancel',   // Frontend URL
//             customer_email: email,                         // Optional: set customer email
//         });

//         // Send only the session ID to the frontend
//         res.json({ sessionId: session.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error creating checkout session');
//     }
// };

