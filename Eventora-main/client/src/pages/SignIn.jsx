import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill up all the fields!'));
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen mt-20 dark:bg-gray-900'>
      <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        <div className='flex-1'>
          <Link to='/' className="font-bold dark:text-white text-4xl">
            <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 hover:bg-gradient-to-l rounded-lg text-white'>
              Eventora's
            </span>
          </Link>
          <p className='text-lg mt-5 dark:text-gray-300'>
           You can sign in with your email and password or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' className='dark:text-gray-300' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
                className='dark:bg-gray-800 dark:text-white'
              />
            </div>
            <div>
              <Label value='Your password' className='dark:text-gray-300' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}
                className='dark:bg-gray-800 dark:text-white'
              />
            </div>
            <Button
              className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold text-white rounded-lg hover:bg-gradient-to-l 
                ${loading ? 'blur-sm' : ''}`}
              disabled={loading}
              type='submit'
            >
              {loading ? (
                <>
                  <Spinner size='sm' className='w-[18px]' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-4 dark:text-gray-300'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-700 hover:text-blue-800 font-semibold dark:text-blue-400 dark:hover:text-blue-500'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200 h-auto rounded-none py-3 px-2 font-semibold'>
              <span className="font-medium">{errorMessage}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
