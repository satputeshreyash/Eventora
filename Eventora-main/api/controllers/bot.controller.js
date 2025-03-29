// import {errorHandler} from "../utils/error.js";
// import fetch from 'node-fetch';

// const WIT_AI_TOKEN = 'YJHJTYOSXS5XYERAAIMM4RFUDP5VWKZR';

// // Function to interact with Wit.ai API
// async function getWitResponse(message) {
//   const response = await fetch(`https://api.wit.ai/message?v=20210626&q=${encodeURIComponent(message)}`, {
//     headers: {
//       Authorization: `Bearer ${WIT_AI_TOKEN}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error('Wit.ai API error:', errorText);
//     return next(errorHandler(500, 'An error occurred while processing your request.'));
//   }

//   const data = await response.json();
//   return data;
// }

// // Mapping intents to responses
// function getResponseFromIntent(intent) {
//   const responses = {
//     faq_create_event: "You can create an event by navigating to the admin dashboard and clicking 'Create Event'.",
//     faq_view_participants: "To view registered participants for an event, go to your admin dashboard and click 'participation'.",
//     update_event: "To update an event, go to the event details and click 'Edit'.",
//     delete_event: "To delete an event, go to the event details page and select 'Delete Event'.",
//     register_to_event: "You can register for an event by visiting the event page and clicking 'Register'.",
//     payment_methods: "You can pay for the event via card or Stripe.",
//     update_profile: "yes one can update their profile, To update your profile, go to your account settings and make the necessary changes.",
//     delete_account: "You can delete your account by visiting your account settings and selecting 'Delete Account'.",
//     event_filter: "You can filter events by date, category, and location on the events page.",
//     event_summary: "To generate an event summary, go to the event participation section of the admin dashboard and click on 'Generate Summary'.",
//     change_password: "You can change your password by visiting your account settings and selecting 'Change Password' and click on update profile.",
//   };

//   return responses[intent] || "Sorry, I didn't understand that. Can you please rephrase?";
// }

// export const bot = async (req, res, next) => {
//     try {
//         const { question } = req.body;
//         console.log("Question: ",question);
        
//         const witResponse = await getWitResponse(question);
//         console.log("With response: ",witResponse);
        
//         const intent = witResponse.intents.length > 0 ? witResponse.intents[0].name : null;

//         if (!intent) {
//             console.warn("No intent matched for the question:", question);
//             return next(errorHandler(403, 'Sorry, I didn’t understand that. Can you please rephrase!'));
//         }        
        
    
//         if (intent) {
//           const response = getResponseFromIntent(intent);
//           console.log("Response: ",response);
//           res.status(200).json({ answer: response });
//         } else {
//         //   res.json({ answer: 'Sorry, I didn’t understand that. Can you please rephrase?' });
//         return next(errorHandler(403, 'Sorry, I didn’t understand that. Can you please rephrase!'))
//         }
//       } catch (error) {
//         console.error('Error processing request:', error);
//         return next(errorHandler(500, 'An error occurred while processing your request.'))
//       }
// };




// bot.controller.js
// bot.controller.js
import fetch from 'node-fetch';

const WIT_AI_TOKEN = 'YJHJTYOSXS5XYERAAIMM4RFUDP5VWKZR';

// Function to interact with Wit.ai API
async function getWitResponse(message) {
    const response = await fetch(`https://api.wit.ai/message?v=20210626&q=${encodeURIComponent(message)}`, {
        headers: {
            Authorization: `Bearer ${WIT_AI_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

  //  console.log("response from wit ai:", response);
    

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Wit.ai API error:', errorText);
        throw new Error('Failed to get response from Wit.ai');
    }

    const data = await response.json();
   // console.log("data from wit ai:", data);
    
    return data;
}

// Mapping intents to responses
function getResponseFromIntent(intent) {
    const responses = {
        faq_event_management: "This event management system helps users create, organize, and manage events efficiently. It allows event organizers to set up new events, update event details, manage participants, and track registrations. Users can register for events, make payments securely via Stripe, and view important event information. The system also supports filtering events by date, category, or location and enables admins to generate summaries and reports on event participation. Overall, it simplifies the entire process of managing events, from creation to completion.",
        faq_create_event: "You can create an event by navigating to the admin dashboard and clicking 'Create Event'.",
        faq_view_participants: "To view registered participants for an event, go to your admin dashboard and click 'participation'.",
        update_event: "To update an event, go to the event details and click 'Edit'.",
        delete_event: "To delete an event, go to the event details page and select 'Delete Event'.",
        register_to_event: "You can register for an event by visiting the event page and clicking 'Register'.",
        payment_methods: "You can pay for the event via card or Stripe.",
        update_profile: "You can update your profile in account settings.",
        delete_account: "You can delete your account by visiting your account settings and selecting 'Delete Account'.",
        event_filter: "You can filter events by date, category, and location on the events page.",
        event_summary: "To generate an event summary, go to the event participation section of the admin dashboard and click on 'Generate Summary'.",
        change_password: "You can change your password in your account settings.",
        payment_failed: "If your payment failed, soon it will be recovered, you directed to cancel page that means your payment was canceled.",
        Hello: "Hello, how can I help you?",
        how_you_doing: "I'm good, how about you?",
        morning: "Good morning, how can I help you?",
        night: "Good night, sleep tight.",
        afternoon: "Good afternoon, how can I help you?",
        evening: "Good evening, how can I help you?",
    };

    return responses[intent] || "Sorry, I didn't understand that. Can you please rephrase?";
}

// Controller function to handle the ask route
export const askBot = async (req, res, next) => {
    try {
        const { question } = req.body;
        const witResponse = await getWitResponse(question);
        const intent = witResponse.intents.length > 0 ? witResponse.intents[0].name : null;

        if (intent) {
            const response = getResponseFromIntent(intent);
            res.json({ answer: response });
        } else {
            res.json({ answer: 'Sorry, I didn’t understand that. Can you please rephrase?' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        next(error); // Pass the error to the existing error handler
    }
};
