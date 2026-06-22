import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import App from './App.tsx'
import './index.css'

import ShowcaseViewScreen from './screens/ShowcaseViewScreen.tsx'
import CreateShowcaseScreen from './screens/CreateShowcaseScreen.tsx'
import LoginScreen from './screens/LoginScreen.tsx'
import RegisterScreen from './screens/RegisterScreen.tsx'
import HomeScreen from './screens/HomeScreen.tsx'
import CartScreen from './screens/cartScreen.tsx'
import ShippingScreen from './screens/ShippingScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import PlaceOrderScreen from './screens/PlaceOrderScreen.tsx';
import OrderScreen from './screens/OrderScreen';  
import ProfileScreen from './screens/ProfileScreen.tsx';
import BecomeSellerScreen from './screens/BecomeSellerScreen.tsx';
import SellerDashboardScreen from './screens/SellerDashboardScreen.tsx';
import EditShowcaseScreen from './screens/EditShowcaseScreen.tsx';
import CategoryScreen from './screens/CategoryScreen.tsx'; 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/create-showcase" element={<CreateShowcaseScreen />} />
      <Route path="/showcase/:slug" element={<ShowcaseViewScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/shipping" element={<ShippingScreen />} /> 
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/placeorder" element={<PlaceOrderScreen />} />
      <Route path="/order/:id" element={<OrderScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/become-seller" element={<BecomeSellerScreen />} />
      <Route path="/seller-dashboard" element={<SellerDashboardScreen />} />
      <Route path="/edit-showcase/:id" element={<EditShowcaseScreen />} />
      <Route path="/category/:categoryName" element={<CategoryScreen />} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)