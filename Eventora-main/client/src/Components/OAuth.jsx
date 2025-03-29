import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import {app} from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {

    const auth = getAuth(app);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            //so everytime you click on google button , you have to select a account from the list of your accounts
            provider.setCustomParameters({
                prompt: 'select_account'
            })

            try {
                const resultsFromGoogle = await signInWithPopup(auth, provider);
               // console.log(resultsFromGoogle.user.photoURL);// it has all the data of signed in user, i.e email id, profile photo etc
               //here we send that data to the backend
               const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'content-type' : 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                })
               })
               const data = await res.json();

               if(res.ok){
                 dispatch(signInSuccess(data))
                 navigate('/');
               }
            } catch (error) {
                console.log(error);
            }

        } catch (error) {
            
        }
    }

  return (
    <div
    onClick={handleGoogleClick}
    className="relative  inline-block p-[2px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg">
      <button
        type="button"
        className=" flex justify-center dark:bg-transparent
          bg-white text-black rounded-lg px-4 py-2 w-full h-full 
          transition-all duration-300
          border-2 border-transparent bg-clip-padding
          hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white
        "
      >
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
      </button>
    </div>
  );
};

export default OAuth;
