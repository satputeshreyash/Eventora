import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from "../Components/DashSidebar";
import DashProfile from "../Components/DashProfile";
import DashPosts from "../Components/DashPosts";
import DashUsers from '../Components/DashUsers';
import DashComments from '../Components/DashComments';
import DashboardComp from "../Components/DashboardComp";
import DashParticipants from "../Components/DashParticipants";

const Dashboard = () => {
 
  const location = useLocation();
  const [tab, setTab] = useState('');
  
  //actually the url is localhost:5173/dashboard?tab=post
  //so based on the tab value i.e post in this case, we will render that component e.g post component inside dashboard page
  //this tab can be anything e.g   localhost:5173/dashboard?tab=profile, profile component will be rendered inside a dashboard page
  //that means page is same but we change the components inside that page based on url i.e tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar/>
      </div>

      {/* profile */}
       {tab === 'profile' && <DashProfile/>}

      {/* posts.. */}
      {tab === 'posts' && <DashPosts/>}

      {/* list of users.. */}
      {tab === 'users' && <DashUsers/>}

      {/* comments */}
      {tab === 'comments' && <DashComments/>}

      {/* dashboard overview  */}
      {tab === 'dash' && <DashboardComp/>}

      {tab === 'participants' && <DashParticipants/>}
    </div>
  )
}

export default Dashboard