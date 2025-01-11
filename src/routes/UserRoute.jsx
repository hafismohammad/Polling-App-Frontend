import { Routes, Route } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Auth from '../auth/Auth';
import Home from '../pages/Home';
import Layouts from '../components/Layouts';
import UserChat from '../components/UserChat';

function UserRoute() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<Auth />}>
        <Route element={<Layouts />}>
         <Route path="/" element={<Home />} />
         <Route path='/chat' element={<UserChat />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}

export default UserRoute;
