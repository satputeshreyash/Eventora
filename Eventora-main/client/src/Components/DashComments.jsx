import { useEffect, useState } from "react";
import {useSelector} from 'react-redux';
import { Table, Button, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal } from "flowbite-react";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore]  = useState(true);
  const [showModal, setShowModal] = useState(false);//it is useful when you want to delete a post then it will show a modal asking you if you want to delete the post
  const [deleteCommentId, setDeleteCommentId] = useState('');
  const [ loading, setLoading ] = useState(false);

  useEffect(()=>{
    const fetchComments = async()=>{
      try {
        setLoading(true);
        //go through post.controller.js file in backend
        const res = await fetch('/api/comment/getcomments');
        const data = await res.json();

        if(!res.ok){
          setLoading(false);
        }

        if(res.ok){
          setLoading(false);
          setComments(data.comments);
          //at the backend in the posts.controller.js we have a limit of 9 posts fetching at a time
          //and when you click on the show more button, you will see the remaining posts displayed on the page
          if(data.comments.length < 9){
            setShowMore(false);
          }
        }

       // console.log(userPosts);
        
      } catch (error) {
        setLoading(false);
        console.log(error.message);
        
      }
    };

    if(currentUser.isAdmin){
       fetchComments();
    }

  },[currentUser._id]);


  //show more posts
  const handleShowMore = async() => {
      const startIndex = comments.length;
      try {
        const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
          setComments((prev) => [...prev, ...data.comments])
          if(data.comments.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
          console.log(error.message);
          
      }
  }


//delete user
const handleDeleteComment = async() => {
   setShowModal(false);
   try {
    const res = await fetch(`/api/comment/deleteComment/${deleteCommentId}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if(!res.ok){
      console.log(data.message);
    } else{
       setComments((comments) => comments.filter((comment) => comment._id !== deleteCommentId));
       setShowModal(false);
    }

   } catch (error) {
     console.log(error.message);
     return;
   }
}


if(loading) return(
  <div className="w-full flex justify-center items-center min-h-screen">
      <Spinner size="xl" />
  </div>
)

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3
     scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
     dark:scrollbar-thumb-slate-500
     ">
      { currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                       {comment.content}
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes} </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span 
                    className="font-medium text-red-600 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true)
                      setDeleteCommentId(comment._id);
                    }}
                    >Delete</span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          {showMore && (
            <button 
            onClick={handleShowMore}
            className="w-full hover:underline text-teal-500 self-center text-sm py-7">Show more</button>
          )}
        </>
      ): 
      (
        <p>You have no comments yet!</p>
      )
    }
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
                <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
               </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComments;