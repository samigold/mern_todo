import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import store from './store';
import { Provider } from 'react-redux';
import App from './App.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreens';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen.jsx';
import Todos from './screens/Todos';
import { Toaster } from 'react-hot-toast';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} path='/' element={<HomeScreen/>}/>
      <Route path='/login' element={<LoginScreen/>}/>
      <Route path='/register' element={<RegisterScreen/>}/>
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/profile' element={<ProfileScreen/>}/>
        <Route path='/todos' element={<Todos/>}/>
      </Route>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <Toaster possition='top-center'/>
      <RouterProvider router={ router } />
    </React.StrictMode>    
  </Provider>
)
