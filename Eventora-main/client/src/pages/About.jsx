import React from 'react'

const About = () => {
  const features = [
    {
      title: 'Event Creation',
      description: 'Admins can create events with multiple sub-events, each having their own pricing and details.',
      icon: '🎉',
    },
    {
      title: 'Event Registration',
      description: 'Students can easily register for events and sub-events through a streamlined registration form, with Stripe payment integration for secure transactions.',
      icon: '📝',
    },
    {
      title: 'Search and Filtering',
      description: 'Users can search for events, filter by categories (coding, workshops, etc.), and sort by latest or oldest.',
      icon: '🔍',
    },
    {
      title: 'Real-Time Updates',
      description: 'Track event details, schedule changes, and registration status in real-time.',
      icon: '⏲️',
    },
    {
      title: 'Sub-Event Management',
      description: 'Add multiple sub-events (like coding challenges, quizzes, workshops) under a main event category, allowing participants to register for individual or multiple sub-events.',
      icon: '🛠️',
    },
    {
      title: 'Admin Dashboard',
      description: 'Event organizers can manage registrations, handle payments, and monitor event activities using a secure dashboard.',
      icon: '📊',
    },
    {
      title: 'Secure Payments',
      description: 'Integrated with Stripe for easy and secure online payments during registration.',
      icon: '💳',
    },
    {
      title: 'PDF Summarization',
      description: 'Generate PDF summaries of event details and participant information for easy tracking and documentation.',
      icon: '📄',
    },
  ];

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center">About Eventora</h1>
      <p className="text-lg mb-8 text-center">
        Welcome to <strong>Eventora</strong> – your comprehensive college event management system! Our platform is designed to streamline the process of organizing and managing events for your college, ensuring that both organizers and participants have a seamless experience.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-center">Our Mission</h2>
      <p className="mb-8 text-center">
        Eventora aims to simplify the complexities of event organization. Whether it's a coding competition, hackathon, workshop, or networking session, our platform makes it easier for administrators to create and manage events while giving students an easy-to-use interface to register and participate.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-center">Core Features</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 mt-10 text-center">Why Eventora?</h2>
      <p className="mb-8 text-center">
        Eventora is built with simplicity and functionality in mind. By automating event management tasks and providing users with a seamless registration experience, we take the hassle out of organizing college events. Whether you're an event organizer or a participant, Eventora ensures that the process is smooth and efficient.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-center">Future Plans</h2>
      <p className="text-center">
        We plan to expand our platform by introducing features like event analytics, feedback collection, and enhanced participant engagement tools to take your event management experience to the next level.
      </p>
    </div>
  )
}

export default About;
