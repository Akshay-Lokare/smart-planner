import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Auth from './Pages/Auth';
import Home from './Pages/Home';
import Planner from './Pages/Planner';
import Settings from './Pages/Settings';

import NotFound from './Pages/NotFound';
import Navbar from './Pages/Navbar';

function App() {
  return (
    <>
    <Navbar />
    <Toaster position='top-right' />
    <Routes>
      <Route path='/home' element={<Home />} />
      <Route path='/auth-page' element={<Auth />} />
      <Route path='/planner' element={<Planner />} />
      <Route path='/settings' element={<Settings />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
    </>

  );
}

export default App;