import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { clearCartItems } from "../store/slices/cartSlice";

const Header: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearCartItems());

    navigate("/login");
  };

  return (
    <header className="bg-slate-900 shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold tracking-wider">
          ClickCraft <span className="text-indigo-500">🚀</span>
        </Link>

        <div className="flex space-x-6 items-center">
          {userInfo ? (
            <>
              <Link
                to="/cart"
                className="text-gray-300 hover:text-white font-medium flex items-center mr-6 transition relative"
              >
                <span className="text-xl mr-1">🛒</span> Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>

              {userInfo &&
                (userInfo.role === "seller" || userInfo.role === "admin") && (
                  <Link
                    to="/create-showcase"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    + Create Showcase
                  </Link>
                )}

              <Link
                to="/profile"
                className="text-gray-300 font-medium ml-4 hover:text-white transition"
              >
                Hi,{" "}
                <span className="text-indigo-400 font-bold">
                  {userInfo.name}
                </span>
              </Link>
              <button
                onClick={logoutHandler}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 text-sm font-semibold ml-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/cart"
                className="text-gray-300 hover:text-white font-medium flex items-center mr-6 transition relative"
              >
                <span className="text-xl mr-1">🛒</span> Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition duration-300 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
