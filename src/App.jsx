import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Equipment from './pages/Equipment';
import Checkout from './pages/Checkout';
import Return from './pages/Return';
import History from "./pages/History";
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from '../src/components/ProtectedRoute';
import Admin from './pages/Admin';
import ForgetPassword from './pages/ForgetPassword';
import Reset from './pages/Reset';



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Auth Routes without Sidebar/navbar */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotPassword' element={<ForgetPassword />} />
        <Route path='/reset/:token' element={<Reset />} />


        {/* Main Dashboard App wrapped in layout */}
        <Route path="/" element={<Layout />}>

          <Route index element={<Dashboard />} />
          <Route path='equipment' element={<Equipment />} />
          <Route path='checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path='return' element={<ProtectedRoute><Return /></ProtectedRoute>} />
          <Route path='history' element={<ProtectedRoute><History /></ProtectedRoute>} />


          <Route path="/admin" element={<ProtectedRoute>
            <Admin />
          </ProtectedRoute>} />

          <Route path='*' element={<NotFound />} />

        </Route>


      </>
    )
  )
  return <RouterProvider router={router} />

}

export default App