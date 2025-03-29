import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col w-screen items-center justify-center h-[calc(100vh-60px)] bg-gray-900 text-white text-center p-6 dark:bg-[rgba(49,65,110,0.66)]">
            <img
                src="src/assets/404.jpg" // Replace this URL with a relevant illustration
                alt="Not Found Illustration"
                className="mb-6 w-full max-w-[600px] h-auto rounded-lg shadow-lg" // Adjust max width as needed
            />
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300 ease-in-out transform hover:scale-105"
                onClick={handleClick}
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;
