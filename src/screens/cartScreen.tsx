import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";
import {
  addToCart,
  removeFromCart,
  type CartItem,
} from "../store/slices/cartSlice";

const CartScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems } = cart;

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const updateQtyHandler = (item: CartItem, newQty: number) => {
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const checkoutHandler = () => {
    if (userInfo) {
        navigate('/shipping');
    } else {
        navigate('/login?redirect=/shipping'); 
    }
  };

  const parsePrice = (priceVal: any) => {
    if (!priceVal) return 0;
    const cleaned = String(priceVal).replace(/[^0-9.]/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.price) * item.qty;
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 border-b pb-4">
        Shopping Cart 🛒
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-500 mb-6">Your cart is empty.</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-6 hover:bg-gray-50 transition p-4 rounded-lg"
              >
                <div className="flex items-center space-x-6 w-2/3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div>
                    <Link
                      to={`/`}
                      className="text-2xl font-bold text-indigo-700 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 font-semibold text-lg mt-1">
                      Rs. {parsePrice(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    className="border-2 border-indigo-200 p-2 rounded-lg bg-white text-indigo-900 font-bold outline-none focus:border-indigo-500 transition"
                    value={item.qty}
                    onChange={(e) =>
                      updateQtyHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(5).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        Qty: {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition"
                    title="Remove Item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-slate-50 p-8 rounded-2xl shadow-inner border border-slate-200 sticky top-10">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Order Summary
              </h2>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                  items):
                </span>
              </div>
              <div className="flex justify-between mb-8 border-b pb-6">
                <span className="text-xl font-bold text-slate-800">Total:</span>
                <span className="text-3xl font-extrabold text-indigo-600">
                  Rs. {calculateTotal().toLocaleString()}
                </span>
              </div>
              <button
                onClick={checkoutHandler}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:-translate-y-1"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;