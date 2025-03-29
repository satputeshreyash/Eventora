import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button, Label, TextInput, Spinner } from 'flowbite-react'; // Import Spinner
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';

const EventRegistrationForm = () => {
  const currentUser = useSelector((state) => state.user);

  if(!currentUser) {
    console.log(currentUser);
    
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Event Registration</h1>
          <p className="text-lg">Please sign in to register for an event.</p>
        </div>
      </div>
    );
  }

  const { eventId, subEventId, eventName, eventPrice } = useParams(); // Include eventId and subEventId
  const [formData, setFormData] = useState({
    name: '',
    rollNoOrFacultyId: '',
    email: '',
  });
  
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, rollNoOrFacultyId, email } = formData;

    const registrationData = {
      eventId,     // Use eventId
      subEventId,  // Use subEventId
      eventName,
      eventPrice,
      email,
    };

    try {
      setLoading(true); // Set loading to true
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (data.sessionId) {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        console.error("Error: No session ID returned");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 mb-6">
      <h1 className="text-2xl font-semibold mb-6">Register for {eventName}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name" value="Name" />
          <TextInput
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="rollNoOrFacultyId" value="Roll Number or Faculty ID" />
          <TextInput
            id="rollNoOrFacultyId"
            name="rollNoOrFacultyId"
            value={formData.rollNoOrFacultyId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            defaultValue={currentUser.email}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="eventPrice" value="Event Price" />
          <TextInput
            id="eventPrice"
            name="eventPrice"
            value={eventPrice}
            readOnly
            disabled
          />
        </div>

        <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </form>
    </div>
  );
};

export default EventRegistrationForm;
