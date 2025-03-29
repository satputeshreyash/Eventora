// PostPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from 'flowbite-react';
import CommentSection from "../Components/CommentSection";
import PostCard from "../Components/PostCard";

const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
              //  console.log(data.posts[0]);
                
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                } 
                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();
                if (res.ok) {
                    setRecentPosts(data.posts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchRecentPosts();
    }, []);

    // Pass eventId and subEventId to the form via URL parameters
    const handleRegister = (eventId, subEventId, eventName, eventPrice) => {
        navigate(`/register/${eventId}/${subEventId}/${eventName}/${eventPrice}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>
    );

    return (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
            <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
            <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
                <Button color="gray" pill size="xs">{post && post.category}</Button>
            </Link>
            <img src={post && post.image} alt={post && post.title}
                className="mt-10 p-3 max-h-[600px] w-full object-cover"
            />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span className="text-[17px]">{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="text-[17px] italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className="p-3 max-w-2xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{ __html: post && post.content }}>
            </div>

            <CommentSection postId={post && post._id} />

            {/* Display sub-events with Register button */}
            {post && post.subEvents && post.subEvents.length > 0 ? (
                <div className="mt-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-5 text-gray-800">Available Sub-Events</h2>
                    <div className="grid grid-cols-1 gap-5">
                        {post.subEvents.map((subEvent, index) => (
                            <div key={index} className="border p-4 rounded-md shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-lg text-gray-800">{subEvent.eventName}</span>
                                    <span className="text-gray-600">${subEvent.eventPrice}</span>
                                </div>
                                <Button
                                    gradientDuoTone="purpleToBlue"
                                    size="md"
                                    onClick={() => handleRegister(post._id, subEvent._id, subEvent.eventName, subEvent.eventPrice)}  // Pass eventId and subEventId (index) here
                                    className="w-full"
                                >
                                    Register
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-5">
                    <h2 className="text-xl">No Sub-Events Available</h2>
                </div>
            )}

            {/* Recent post section */}
            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent events</h1>
                <div className="flex flex-wrap gap-3 mt-5 justify-center">
                    {recentPosts && recentPosts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default PostPage;
