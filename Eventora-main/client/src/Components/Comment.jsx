import {useState, useEffect} from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from 'react-icons/fa';
import { Button, Textarea } from 'flowbite-react';

//below parameter 'comment' is coming from CommentSection.jsx
const Comment = ({ comment, onLike, onEdit, onDelete }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [user, setUser] = useState({});
    const {currentUser} = useSelector(state => state.user);

    
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
                return;
            }
        }

        getUser();
    }, [comment]);


    //to show the textarea for editing
    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    //updating the comment
    const handleSave = async() => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
             })

             if(res.ok){
                setIsEditing(false);
                onEdit(comment, editedContent);//to update the comment in the parent component i.e CommentSection.jsx
             }
         }
         catch (error) {
            console.log(error.message);
            return;
        }
    }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-xs truncate'>
                    {user ? `@${user.username}` : `Anonymous user`}</span>
                <span className='text-gray-500 mr-1 text-xs'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            {
               isEditing ? (
                <>
                 <Textarea
                    className='mb-2'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                 />
                 <div className='flex gap-2 justify-end text-xs'>
                    <Button type='button' 
                        size='sm'
                        gradientDuoTone='purpleToBlue'
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button type='button' 
                        size='sm'
                        gradientDuoTone='purpleToBlue'
                        outline
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </Button>
                 </div>
                </>
               ) :
               (
                <>
                    <p className='text-gray-500 mb-2 text-sm'>{comment.content}</p>
                    <div className='flex items-center pt-2 text-xs border-t
                    dark:border-gray-700 max-w-fit gap-2'>
                        <button type='button' 
                        className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}
                        onClick={() => onLike(comment._id)}
                        >
                            <FaThumbsUp className='text-sm'/>
                        </button>
                        <p className='text-gray-400'>
                            {
                            comment.numberOfLikes > 0 && comment.
                            numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                            }
                        </p>
                        {
                            currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) &&
                            (
                                <>
                                    <button
                                    type='button'
                                    className='text-gray-400 hover:text-blue-500'
                                    onClick={handleEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                    type='button'
                                    className='text-gray-400 hover:text-red-500'
                                    onClick={() => onDelete(comment._id)}
                                    >
                                        Delete
                                    </button> 
                                </>
                            )
                        }
                    </div>
                </>
               )
            }
        </div>
    </div>
  )
}

export default Comment