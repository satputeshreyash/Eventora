"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');

    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);


    //signout function
const handleSignOut = async() => {
    try {
  
      const res = await fetch('/api/user/signout', {
       method: 'POST'
      });
  
      const data = await res.json();
  
      if(!res.ok){
        console.log(data.message);
      } else{
        dispatch(signoutSuccess());
      }
  
    } catch (error) {
      console.log(error.message);
    }
  }


    return (
        <Sidebar aria-label="Default sidebar example" className="w-full md:w-56 bg-gray-50 text-gray-900">
            <Sidebar.Items>            
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                { currentUser && currentUser.isAdmin && 
                        (
                        <Link 
                        to='/dashboard?tab=dash'
                        >
                            <Sidebar.Item
                            active={tab === 'dash' || !tab}
                            icon={HiChartPie}
                            as='div'
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                        )
                    }
                    <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item 
                            icon={HiUser} 
                            label={currentUser.isAdmin ? 'Admin' : 'User'}
                            className={`w-full h-10 pr-2 py-2 mb-2 hover:bg-gray-200 ${tab === 'profile' ? 'bg-gray-200' : ''}`}
                            active={tab === 'profile'}
                            as='div'
                    >
                        Profile
                    </Sidebar.Item>
                    </Link>
                    { currentUser.isAdmin && 
                        (
                        <Link 
                        to='/dashboard?tab=posts'
                        as='div'
                        >
                            <Sidebar.Item
                            active={tab === 'posts'}
                            icon={HiDocumentText}
                            >
                                Posts
                            </Sidebar.Item>
                        </Link>
                        )
                    }
                    { currentUser.isAdmin && 
                        (
                        <Link 
                        to='/dashboard?tab=participants'
                        as='div'
                        >
                            <Sidebar.Item
                            active={tab === 'participants'}
                            icon={HiDocumentText}
                            >
                                Participants
                            </Sidebar.Item>
                        </Link>
                        )
                    }
                    { currentUser.isAdmin && 
                        (
                            <>
                                <Link 
                                to='/dashboard?tab=users'
                                as='div'
                                >
                                    <Sidebar.Item
                                    active={tab === 'users'}
                                    icon={HiOutlineUserGroup}
                                    >
                                        Users
                                    </Sidebar.Item>
                                </Link>
                                <Link 
                                to='/dashboard?tab=comments'
                                as='div'
                                >
                                    <Sidebar.Item
                                    active={tab === 'comments'}
                                    icon={HiAnnotation}
                                    >
                                        Comments
                                    </Sidebar.Item>
                                </Link>
                            </>
                       
                        )
                    }
                    <Sidebar.Item 
                        onClick={handleSignOut}
                        icon={HiArrowSmRight} 
                        className="cursor-pointer w-full h-10 pr-2 py-2 mb-1 hover:bg-gray-200"
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default DashSidebar;
