import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'
import Footer from './components/footer'
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/buyer/home'
import Property from './pages/buyer/property'
import Dashboard from './pages/seller/dashboard'
import AddListing from './pages/seller/addListing'


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian text-white font-sans flex flex-col">
        <Navbar/>
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/home' element={<Home/>}/>
            <Route path='/property' element={<Property/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/addlisting' element={<AddListing/>}/>
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;