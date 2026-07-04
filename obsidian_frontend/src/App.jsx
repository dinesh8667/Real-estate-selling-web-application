import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute, DashboardRoute } from './authentication/privateRoute'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/buyer/home'
import Browse from './pages/buyer/browse'
import Property from './pages/buyer/property'
import Saved from './pages/buyer/saved'
import Profile from './pages/buyer/profile'
import Notification from './pages/buyer/notification'
import Chat from './pages/buyer/chat'
import Dashboard from './pages/seller/dashboard'
import SellerProfile from './pages/seller/profile'
import AddListing from './pages/seller/addListing'
import Edit from './pages/seller/edit'
import SellerChat from './pages/seller/chat'
import SellerNotification from './pages/seller/notification'
import { useEffect, useState } from 'react';


function App() {
  const [search, setSearch] = useState({ location: '', price: '' })
  const [message, setMessage] = useState({ name: '', phone_number: '', email: '', message: '' })
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-obsidian text-white font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home setSearch={setSearch} search={search} />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/browse' element={
              <PrivateRoute><Browse setSearch={setSearch} search={search} /></PrivateRoute>} />
            <Route path='/property/:id' element={
              <PrivateRoute><Property setMessage={setMessage} message={message} /></PrivateRoute>} />
            <Route path='/saved' element={
              <PrivateRoute><Saved /></PrivateRoute>} />
            <Route path='/profile' element={
              <PrivateRoute><Profile /></PrivateRoute>} />
            <Route path='/dashboard' element={
              <DashboardRoute><Dashboard /></DashboardRoute>} />
            <Route path='/addlisting' element={
              <PrivateRoute><AddListing /></PrivateRoute>} />
            <Route path='/edit/:id' element={
              <PrivateRoute><Edit /></PrivateRoute>} />
            <Route path='/seller/profile' element={
              <PrivateRoute><SellerProfile /></PrivateRoute>} />
            <Route path='/notification' element={
              <PrivateRoute><Notification /></PrivateRoute>} />
            <Route path='/sellernotification' element={
              <PrivateRoute><SellerNotification /></PrivateRoute>} />
            <Route path='/chat/:propertyId/:receiverId/:senderId' element={
              <PrivateRoute><Chat messagePayload={message} /></PrivateRoute>} />
            <Route path='/seller/chat/:propertyId/:receiverId/:senderId' element={
              <PrivateRoute><SellerChat /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;