import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Participations = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [participations, setParticipations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigate

    if(!currentUser){
        navigate('/sign-in');
    }

    useEffect(() => {
        const fetchParticipations = async () => {
            try {
                const response = await fetch(`/api/user/${currentUser._id}/participations`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setParticipations(data);
               // console.log(data);
                
            } catch (error) {
                console.error("Failed to fetch participations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipations();
    }, [currentUser?._id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>
    );

    // Function to handle card click
    const handleCardClick = (slug) => {
        navigate(`/post/${slug}`); // Navigate to PostPage with the slug
    };

    return (
        <div className="min-h-[calc(100vh-80px)] p-4 m-10"> {/* Set minimum height and padding */}
        {
            participations && participations?.length === 0 ? (
                <div className="flex justify-center items-center min-h-screen">
                    <h1 className="text-2xl font-bold text-center">No participations found</h1>
                </div>
            ) :
            (
                <>
                    <h1 className="text-4xl font-bold text-center mb-7">Your Participations</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participations?.map((participation) => (
                            <div 
                                key={participation?.mainEvent?._id} 
                                className="border-2 border-sky-500 p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                                onClick={() => handleCardClick(participation?.mainEvent?.slug)} // Add click handler
                            >
                                <img 
                                    src={participation?.mainEvent?.image} 
                                    alt={participation?.mainEvent?.title} 
                                    className="w-full h-24 object-cover rounded-md"
                                />
                                <h2 className="text-lg font-semibold">{participation?.mainEvent?.title}</h2>
                                <h3 className="mt-2">Sub-Events:</h3>
                                <ul>
                                    {participation?.subEvents?.map((subEvent, index) => (
                                        <li key={subEvent.subEventId} className={`py-2 ${index !== participation.subEvents.length - 1 ? 'border-b' : ''}`}>
                                            <span>{subEvent.eventName}</span> - <span>${subEvent.eventPrice}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </>
            )
        }
            
        </div>
    );
};

export default Participations;
