import { errorHandler } from '../utils/error.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js'; // Import user model
import { exec } from "child_process";
import { fileURLToPath } from 'url';
import path from 'path';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate summary
export const generateSummary = async (req, res) => {
    try {
        const { postId } = req.params;
        // Fetch the event and populate subEvents and their participants
        const event = await Post.findById(postId).populate({
            path: 'subEvents.participants.userId',
            model: 'User'
        });

        if (!event) {
            return res.status(404).send("Event not found");
        }

        // Prepare participants data for each subEvent
        const participantsData = await Promise.all(
            event.subEvents.map(async (subEvent) => {
                // Get the participants for the current subEvent using the mainEventId
                const participants = await User.find({ 
                    'participations.mainEventId': postId, 
                    'participations.subEvents.subEventId': subEvent._id 
                }).populate('participations.subEvents.subEventId'); // Populate subEvent details

                return {
                    eventName: subEvent.eventName,
                    eventPrice: subEvent.eventPrice,
                    participants: participants.map(p => ({
                        username: p.username,
                        userId: p._id,
                        profilePicture: p.profilePicture // Optional: Include profile picture if needed
                    }))
                };
            })
        );

        // Format the summary data
        const summaryData = {
            title: event.title,
            createdAt: event.createdAt,
            participantsData: participantsData.filter(pd => pd.participants.length > 0) // Filter out sub-events with no participants
        };

        // Convert summary data to JSON string and pass it to the Python script
        const summaryDataJSON = JSON.stringify(summaryData);
        const pythonScriptPath = path.join(__dirname, "../event_summary.py"); // Correct path to the Python script

        const command = `python "${pythonScriptPath}"`;
        const childProcess = exec(command, { encoding: 'utf8' }, (error) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return res.status(500).send("Error generating summary");
            }
        });

        // Send summary data as input to the Python script
        childProcess.stdin.write(summaryDataJSON);
        childProcess.stdin.end();

        // Once the PDF is generated, send it for download
        childProcess.on("close", () => {
            const pdfPath = path.join(__dirname, "../event_summary.pdf"); // Adjust path if necessary
            res.download(pdfPath, "event_summary.pdf", (err) => {
                if (err) {
                    console.error("Error sending the PDF:", err);
                    return res.status(500).send("Error downloading the PDF");
                }
            });
        });
    } catch (error) {
        console.error("Error generating summary:", error);
        return res.status(500).send("Server error");
    }
};




export const create = async (req, res, next) => {
    //we have added isAdmin property while creating a cookie to the token when the user sign in along with it's id
    //isAdmin property can be either false or true depends we have given authority to be admin in the database
    //go through auth.controller.js, and verifyToken.js
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post!'));
    }

    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields!'));
    }

    const slug = req.body.title
                 .split(' ')
                 .join('-')
                 .toLowerCase()
                 .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    });//req.user.id is coming from verifyToken.js file, we get it from the token
    //we add post with user id as there can be multiple admins in the system that will create a post

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        return next(error);
    }

}


//get posts
export const getposts = async (req, res, next) => {
    try {
        // In order to show pagination to the user, we won't fetch all the posts at once.
        // Instead, we will give some limit e.g., initially 9 posts will be fetched,
        // and when the user clicks on the "show more" button, we will show the next remaining posts after that.
        const startIndex = parseInt(req.query.startIndex) || 0; // e.g., we want to start from 9 or 10
        const limit = parseInt(req.query.limit) || 9; // we want to show 3 posts for each 3 rows, so a total of 9 posts at a time
        const sortDirection = req.query.order === 'asc' ? 1 : -1; // we will sort posts in ascending or descending order based on the updated time of that post, when it was last updated

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments(); // this count will be visible on the dashboard of admin

        const now = new Date();

        // We want to show posts that were created in the last month on the dashboard of admin
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
    } catch (error) {
        return next(error);
    }
};

// In posts.controller.js
export const getAllPostsForAdmin = async (req, res, next) => {
    // Ensure only admins can access this route
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to access this data!'));
    }

    try {
        // Find posts where userId matches the admin's ID (i.e., req.user.id)
        const userId = req.params.userId;
       // console.log(userId);
        
        const posts = await Post.find({ userId: userId })
            .populate({
                path: 'subEvents.participants', // Populate participants for sub-events
                select: 'username email _id'   // Select necessary fields from participants
            })
            .exec();

        //  console.log(posts);
            

        // Format posts to include detailed info for admin
        const formattedPosts = posts.map(post => ({
            postId: post._id,
            postTitle: post.title,
            postCategory: post.category,
            postCreationDate: post.createdAt, // Assuming you have a creationDate field
            postImage: post.image, // Assuming you have an image field
            subEvents: post.subEvents.length > 0 ? post.subEvents.map(subEvent => ({
                subEventName: subEvent.eventName || "Unnamed Sub Event",
                subEventPrice: subEvent.eventPrice,
                participants: subEvent.participants.length > 0 ? subEvent.participants.map(participant => ({
                    userId: participant.userId
                })) : []
            })) : [] // Return an empty array if no subEvents
        }));

       // console.log(formattedPosts);
        

        // Respond with the posts data
        res.status(200).json({ posts: formattedPosts });
    } catch (error) {
        console.error(error);
        return next(errorHandler(500, 'Error fetching posts for admin'));
    }
};


//generate post summary
// export const generateSummary = async (req, res) => {
//     try {
//       const { postId } = req.params;
//       const event = await Post.findById(postId).populate('subEvents.participants.userId');
//       console.log(event);
      
  
//       if (!event) {
//         return res.status(404).send("Event not found");
//       }
  
//       // Convert event data to JSON string and pass it to the Python script
//       const eventData = JSON.stringify(event);
//       const pythonScriptPath = path.join(__dirname, "event_summary.py");
//       console.log(pythonScriptPath);
      
  
//       const command = `python ${pythonScriptPath}`;
//       const childProcess = exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error executing Python script: ${error.message}`);
//           return res.status(500).send("Error generating summary");
//         }
//       });
  
//       // Send event data as input to the Python script
//       childProcess.stdin.write(eventData);
//       childProcess.stdin.end();
  
//       // Once the PDF is generated, send it for download
//       childProcess.on("close", () => {
//         const pdfPath = path.join(__dirname, "event_summary.pdf");
//         res.download(pdfPath, "event_summary.pdf", (err) => {
//           if (err) {
//             console.error("Error sending the PDF:", err);
//             return res.status(500).send("Error downloading the PDF");
//           }
//         });
//       });
//     } catch (error) {
//       console.error("Error generating summary:", error);
//       return res.status(500).send("Server error");
//     }
//   };
  


//update post
export const updatepost = async(req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this post!'));
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image
                }
            }, { new:true }
        );

        res.status(200).json(updatedPost);

    } catch (error) {
        return  next(error);
    }
}


//delete post
export const deletepost = async(req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this post!'));
    };

    try {
       await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post has been deleted!');
    } catch (error) {
        return next(error)
    }
}