import { Button } from 'flowbite-react'
import {useState, useEffect} from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500
        justify-center items-center rounded-tl-3xl rounded-bl-3xl text-center mt-4
 '>
        <div className='flex flex-col flex-1 justify-center 
        '>
            <h2 className='text-2xl'>Want to learn more about Javascipt?</h2>
            <p className='text-gray-500 my-2'>Checkout these resources with 100 Javascipt Projects</p>
            <Button gradientDuoTone="purpleToPink"
            className='rounded-tl-xl rounded-bl-none'
            >
                <a href="https://github.com/rohit-dongare" target='_blank'
                rel='noopener noreferrer'
                >
                    GitHub
                </a>
            </Button>
        </div>
        <div className='p-5 flex flex-col flex-1 justify-center '>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1DmLCy9PSJfFqO55mNTYOQLx3x8THsbokkw&s"
             alt="" />
        </div>
    </div>
  )
}

export default CallToAction