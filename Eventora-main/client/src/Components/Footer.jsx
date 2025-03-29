import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook,BsInstagram, BsTwitter,BsGithub, BsDribbble   } from 'react-icons/bs';

const FooterComponent = () => {
  return (
    <Footer container className='border border-t-8 px-3 py-4 border-teal-500 dark:text-white dark:bg-[rgba(49,65,110,0.66)]'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className='mb-3 mt-5'>
                  <Link to='/' className="text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white">
                    <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 
                    hover:bg-gradient-to-l
                     rounded-lg text-white'>
                     Eventora
                    </span>
                  </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                     <Footer.Title title='About' className='mb-4 font-bold'/>
                     <Footer.LinkGroup col>
                         <Footer.Link href='/' target='_blank' rel='noopener noreferrer' className='hover:text-sky-500 mt-2'>Home</Footer.Link>
                     </Footer.LinkGroup>
                     <Footer.LinkGroup col>
                         <Footer.Link href='/about' target='_blank' rel='noopener noreferrer' className='hover:text-sky-500 mt-2'>Eventora</Footer.Link>
                     </Footer.LinkGroup>
                    </div>
                    <div>
                     <Footer.Title title='Follow me' className='mb-4 font-bold'/>
                     <Footer.LinkGroup col>
                         <Footer.Link href='https://www.github.com/rohit-dongare' target='_blank' rel='noopener noreferrer' className='hover:text-sky-500 mt-2'>Github</Footer.Link>
                     </Footer.LinkGroup>
                     <Footer.LinkGroup col>
                         <Footer.Link href='#' target='_blank' rel='noopener noreferrer' className='hover:text-sky-500 mt-2'>Discord</Footer.Link>
                     </Footer.LinkGroup>
                    </div>
                    <div>
                     <Footer.Title title='Legal' className='mb-4 font-bold'/>
                     <Footer.LinkGroup col>
                         <Footer.Link href='#' target='_blank' rel='noopener noreferrer' className='hover:text-sky-500 mt-2'>Privacy Policy</Footer.Link>
                     </Footer.LinkGroup>
                     <Footer.LinkGroup col>
                         <Footer.Link href='#' target='_blank' rel='noopener noreferrer' className='hover:text-sky-500 mt-2'>Terms &amp; Conditions</Footer.Link>
                     </Footer.LinkGroup>
                    </div>
                </div>  
            </div>
            <Footer.Divider className='mt-3 mb-3 border-black'/>
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright
                  className='text-gray-900 dark:text-white dark:hover:hover:text-sky-500 hover:text-sky-500'
                  href='#'
                  by=" Eventora"
                  year={new Date().getFullYear()}
                />
                <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href='#' icon={BsFacebook} className='dark:text-white dark:hover:hover:text-sky-500'/>
                    <Footer.Icon href='#' icon={BsInstagram} className='dark:text-white dark:hover:hover:text-sky-500'/>
                    <Footer.Icon href='#' icon={BsTwitter} className='dark:text-white dark:hover:hover:text-sky-500'/>
                    <Footer.Icon href='https://www.github.com/rohit-dongare' icon={BsGithub} className='dark:text-white dark:hover:hover:text-sky-500' />
                    <Footer.Icon href='#' icon={BsDribbble} className='dark:text-white dark:hover:hover:text-sky-500' />
                </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterComponent