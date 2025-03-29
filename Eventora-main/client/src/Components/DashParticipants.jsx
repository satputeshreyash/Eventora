import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Spinner, Button } from 'flowbite-react';

const DashParticipants = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState(null); // Track which post is loading

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/post/getAllPostsForAdmin/${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
          setLoading(false);
        } else {
          console.log("Error fetching posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
      setLoading(false);
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  const handleSummaryClick = async (post) => {
    try {
      setLoadingPostId(post.postId); // Set the loading post ID
      const response = await fetch(`/api/post/generate-summary/${post.postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`, // assuming JWT for authentication
        },
      });
  
      if (response.ok) {
        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'event_summary.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error generating summary:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoadingPostId(null); // Reset loading post ID after processing
    }
  };

  return (
    <div className="table-auto overflow-x-scroll mx-auto p-3
      scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
      dark:scrollbar-thumb-slate-500
    ">
      {currentUser?.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Sub Events</Table.HeadCell>
              <Table.HeadCell>Participants</Table.HeadCell>
              <Table.HeadCell>Creation Date</Table.HeadCell>
              <Table.HeadCell>Event Image</Table.HeadCell>
              <Table.HeadCell>Summary</Table.HeadCell> {/* New column for Summary button */}
            </Table.Head>
            <Table.Body className="divide-y">
              {posts?.map((post, index) => (
                <>
                  {/* First row for the main post data */}
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                    <Table.Cell rowSpan={post.subEvents.length > 0 ? post.subEvents.length : 1}>
                      {post.postTitle}
                    </Table.Cell>
                    <Table.Cell rowSpan={post.subEvents.length > 0 ? post.subEvents.length : 1}>
                      {post.postCategory}
                    </Table.Cell>
                    
                    {/* SubEvent handling in separate rows */}
                    {post.subEvents.length > 0 ? (
                      <Table.Cell>
                        {post.subEvents[0].subEventName} - ${post.subEvents[0].subEventPrice}
                      </Table.Cell>
                    ) : (
                      <Table.Cell>No Sub Events</Table.Cell>
                    )}

                    {post.subEvents.length > 0 ? (
                      <Table.Cell>
                        {post.subEvents[0].participants.length > 0 ? (
                          post.subEvents[0].participants.map((participant, pIdx) => (
                            <div key={pIdx}>{participant.userId}</div>
                          ))
                        ) : (
                          "No Participants"
                        )}
                      </Table.Cell>
                    ) : (
                      <Table.Cell>No Participants</Table.Cell>
                    )}

                    <Table.Cell rowSpan={post.subEvents.length > 0 ? post.subEvents.length : 1}>
                      {new Date(post.postCreationDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell rowSpan={post.subEvents.length > 0 ? post.subEvents.length : 1}>
                      {post.postImage ? (
                        <img src={post.postImage} alt={`${post.postTitle} image`} className="w-20 h-20 object-cover" />
                      ) : (
                        "No Image"
                      )}
                    </Table.Cell>
                    <Table.Cell rowSpan={post.subEvents.length > 0 ? post.subEvents.length : 1}>
                      {/* Add the Summary button here */}
                      <Button onClick={() => handleSummaryClick(post)}>
                        {loadingPostId === post.postId ? "Generating..." : "Generate Summary"}
                      </Button>
                    </Table.Cell>
                  </Table.Row>

                  {/* Additional rows for the rest of the sub-events */}
                  {post.subEvents.length > 1 &&
                    post.subEvents.slice(1).map((subEvent, idx) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idx}>
                        <Table.Cell>
                          {subEvent.subEventName} - ${subEvent.subEventPrice}
                        </Table.Cell>
                        <Table.Cell>
                          {subEvent.participants.length > 0 ? (
                            subEvent.participants.map((participant, pIdx) => (
                              <div key={pIdx}>{participant.userId}</div>
                            ))
                          ) : (
                            "No Participants"
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default DashParticipants;
