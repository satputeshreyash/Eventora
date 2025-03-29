import {useSelector} from 'react-redux';
import { useState, useEffect } from 'react';
import { Alert, Button, Textarea, Modal} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment'; 
import { HiOutlineExclamationCircle } from "react-icons/hi";


//below parameter i.e postId is coming from postPage.jsx
const CommentSection = ({ postId }) => {

    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');//for submitting the comment field textArea field
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);//for displaying the comments of this post when we get them from the api route
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

   const navigate = useNavigate();//this is for the user if he wants to like the comment but
   //he is not authenticated then we will navigate him to the sign-in page and after sign in he can like the comments
    
    //submit the comment
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if(comment.length > 200){
            return;
        }

        try {

            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            });

            const data = await res.json();

            if(res.ok){
                setComment('');
                setCommentError(null);
                setComments([data, ...comments]);
            }

            if(!res.ok){
                setCommentError(data.message);
            }

        } catch (error) {
            setCommentError(error.message);
            return;
        }
        
    }

    //get comments of this post
    useEffect(() => {
        const getComments = async() => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                const data = await res.json();

            if(!res.ok){
               // console.log(data.message);
                return;
            }

            if(res.ok){
                setComments(data);
            }

            } catch (error) {
                console.log(error.message);
            }
        }

        getComments();

    }, [postId]);


    //like comment or dislike, this function will be called from Comment.jsx component
    const handleLike = async(commentId) => {
        try {
            //this is for the user if he wants to like the comment but
   //he is not authenticated then we will navigate him to the sign-in page and after sign in he can like the comments
            if(!currentUser){ 
                navigate('/sign-in');
                return;
            } 

            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT'
            });

            if(res.ok){
                const data = await res.json();

                setComments(
                 comments.map((comment) => 
                    comment._id === commentId 
                 ?  {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.numberOfLikes
                    }
                    :
                    comment
                ));
            }    

        } catch (error) {
            console.log(error.message);
            return;
        }
    }

    //edit comment, this function will be called from Comment.jsx component
    const handleEdit = (comment, editedContent) => {
        setComments(
            comments.map((c) => 
                c._id === comment._id ?
                {
                    ...c,
                    content: editedContent
                } :
                c
            )
        )
    }

    //delete comment, this function will be called from Comment.jsx component
    const handleDelete = async(commentId) => {
        setShowModal(false);
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }

            const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
                    method: 'DELETE'
                });

            if(res.ok){
                const data = await res.json();
                setComments(
                    comments.filter((c) => c._id !== commentId)
                )
            }
        } catch (error) {
            
        }
    }


  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currentUser ? 
            (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as: </p>
                    <img
                    className='h-6 w-6 ml-1 object-cover rounded-full'
                    src={currentUser.profilePicture} alt="" />
                    <Link to={`/dashboard?tab=profile`}
                    className='text-sm text-cyan-600 hover:underline'
                    >
                        @{currentUser.username}
                    </Link>
                </div>
            ) :
            (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link to='/sign-in' 
                     className='text-blue-500 hover:underline'
                    >Sign in</Link>
                </div>
            )
        }
        {
            currentUser && (
                <form
                onSubmit={handleSubmit}
                className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                    placeholder='Add a comment...'
                    rows={3}
                    maxLength='200'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-sm'>
                            {200 - comment.length} characters remaining</p>
                        <Button outline gradientDuoTone="purpleToBlue"
                        type='submit'
                        >
                            Submit
                        </Button>
                    </div>
                   { commentError && 
                        (<Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                        )
                   }
                </form>      
            )}

            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                <div className='texts-m my-5 flex items-center gap-1'>
                    <p>Comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>
                {
                    comments.map((comment) => (
                        <Comment
                          key={comment._id}
                          comment={comment}
                          onLike={handleLike}
                          onEdit={handleEdit}
                          onDelete={(commentId) => {
                            setShowModal(true)
                            setCommentToDelete(commentId)
                        }}
                        />
                    ) )
                }
                </>
            )}
            <Modal show={showModal}
                onClose={ () => setShowModal(false)}
                popup
                size='md'
                >
                <Modal.Header/>
                <Modal.Body>
                    <div className="text-center">
                    <HiOutlineExclamationCircle 
                    className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?    
                    </h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Yes, I'm sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                    </div>
                </Modal.Body>
             </Modal>
    </div>
  )
}

export default CommentSection