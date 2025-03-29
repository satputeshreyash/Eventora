import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Header from './Components/Header';
import Search from './pages/Search';
import Footer from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './Components/ScrollToTop';
import EventRegistrationForm from './pages/EventRegistrationForm';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import Participations from './pages/Participations';
import NotFound from './pages/NotFound';
import About from './pages/About';
import AskBot from './Components/AskBot';

const App = () => {

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/search" element={<Search/>} />
        <Route element={<PrivateRoute/>}>
         <Route path="/dashboard" element={<Dashboard/>} />
         <Route path="/register/:eventId/:subEventId/:eventName/:eventPrice" element={<EventRegistrationForm />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
         <Route path="/create-post" element={<CreatePost/>} />
         <Route path="/update-post/:postId" element={<UpdatePost/>} />
        </Route>
        <Route path='/about' element={<About/>} />
        <Route path="/post/:postSlug" element={<PostPage/>} />
        <Route path="/success" element={<SuccessPage/>} />
        <Route path="/cancel" element={<CancelPage/>} />
        <Route path="/participations" element={<Participations/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>

      <AskBot />

      <Footer/>
    </BrowserRouter>
  )
}

export default App