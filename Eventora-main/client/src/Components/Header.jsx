import React, { useEffect, useState } from 'react';
import { TextInput, Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscChromeClose } from "react-icons/vsc";
import { useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { SlMenu } from "react-icons/sl";
import { useSelector, useDispatch } from 'react-redux';
import { IoIosLogOut } from "react-icons/io";
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    setMobileMenu(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMobileMenu(false);
    }, 1000);
  }, [location]);

  const openMobileMenu = () => {
    setMobileMenu(true);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  const isActive = (currentPath) => {
    return path === currentPath ? "text-sky-500 font-bold" : "hover:text-sky-500";
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className={`flex items-center justify-between bg-white dark:bg-[rgba(49,65,110,0.66)] dark:text-gray-400 py-2 px-4 z-[2] relative ${mobileMenu ? '' : 'shadow-md'}`}>
      <Link to='/' className="text-sm sm:text-xl font-semibold dark:text-white">
        <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 hover:bg-gradient-to-l rounded-lg text-white'>
          Eventora
        </span>
      </Link>
      <form className='relative hidden lg:flex items-center mx-4' onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          className='dark:bg-gray-800 dark:text-white'
          style={{ paddingRight: '2.5rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AiOutlineSearch className="absolute left-48 text-gray-500 dark:text-gray-300 text-2xl" />
      </form>
      <Button className='lg:hidden flex items-center justify-center w-12 h-10 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-shadow'>
        <AiOutlineSearch className='text-2xl' />
      </Button>
      <div className='flex items-center gap-4 md:order-2'>
        <Button className='w-12 h-10 flex items-center justify-center dark:bg-gray-500 dark:text-white' color='gray' pill onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser && currentUser.currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.currentUser.profilePicture} rounded className='h-auto' />}>
            <Dropdown.Header>
              <span className='block text-sm'>{currentUser.currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.currentUser.email}</span>
            </Dropdown.Header>
            {currentUser.currentUser.isAdmin && (
              <Link to={'/dashboard?tab=dash'}>
                <Dropdown.Item className='hover:bg-sky-200 dark:hover:bg-sky-700 font-semibold'>Dashboard</Dropdown.Item>
              </Link>
            )}
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item className='hover:bg-sky-200 dark:hover:bg-sky-700 font-semibold'>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider className='border-black dark:border-gray-700' />
            <Dropdown.Item onClick={handleSignOut} className='hover:bg-sky-200 dark:hover:bg-sky-700 font-semibold'>
              Sign out <IoIosLogOut className='w-6 h-6 pl-1 font-semibold' />
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button className='p-1 h-10 hidden sm:flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-white rounded-lg hover:bg-gradient-to-l'>
              Sign in
            </Button>
          </Link>
        )}
        {mobileMenu ? (
          <VscChromeClose onClick={closeMobileMenu} className='w-[30px] h-[30px] cursor-pointer p-1 lg:hidden transition-transform duration-200 ease' />
        ) : (
          <SlMenu onClick={openMobileMenu} className='w-[30px] h-[30px] cursor-pointer lg:hidden transition-transform duration-200 ease' />
        )}
      </div>

      <div className={`lg:flex gap-6 ${mobileMenu ? 'absolute top-[58px] left-0 w-full flex flex-col items-start gap-2 bg-white dark:bg-gray-800 text-gray py-4 px-6 transition-all duration-300 ease-in-out border-2 dark:border-gray-700' : 'hidden'}`}>
        <Link className={`${isActive('/')} hover:text-sky-500 ${mobileMenu ? 'w-full h-5 py-2' : ''}`} to="/">Home</Link>
        <Link className={`${isActive('/about')} hover:text-sky-500 ${mobileMenu ? 'w-full h-5 py-2' : ''}`} to="/about">About</Link>
        <Link className={`${isActive('/participations')} hover:text-sky-500 ${mobileMenu ? 'w-full h-5 py-2' : ''}`} to="/participations">Participations</Link>
        {/* {currentUser.currentUser && (
          <Link to="/participations" className={`${isActive('/participations')} hover:text-sky-500 ${mobileMenu ? 'w-full h-5 py-2' : ''}`}>Participations</Link>
        )} */}
        {currentUser.currentUser && currentUser.currentUser.isAdmin && (
          <Link to="/create-post" className={`${isActive('/create-post')} hover:text-sky-500 ${mobileMenu ? 'w-full h-5 py-2' : ''}`}>
            Add Event
          </Link>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
