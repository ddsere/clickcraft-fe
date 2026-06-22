import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store";
import CheckoutSteps from "../components/CheckoutSteps";
import axios from "axios";
import { clearCartItems } from "../store/slices/cartSlice";

const PlaceOrderScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  const parsePrice = (priceVal: any) => {
    if (!priceVal) return 0;
    const cleaned = String(priceVal).replace(/[^0-9.]/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const itemsPrice = cart.cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.qty;
  }, 0);

  const shippingPrice = itemsPrice > 50000 ? 0 : 500;
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError("");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          sellerId: cart.cartItems[0].sellerId,
        },
        config,
      );

      dispatch(clearCartItems());
      alert("Order Placed Successfully! 🎉");
      navigate(`/order/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <CheckoutSteps step1 step2 step3 step4 />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong>Error: </strong> {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
              Shipping Details
            </h2>
            <p className="text-gray-700 text-lg">
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
              Payment Method
            </h2>
            <p className="text-gray-700 text-lg">
              <strong>Method: </strong>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold text-sm ml-2">
                {cart.paymentMethod}
              </span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
              Order Items
            </h2>
            {cart.cartItems.length === 0 ? (
              <div className="text-red-500 font-bold">Your cart is empty</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cart.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md shadow"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                      )}
                      <Link
                        to={`/`}
                        className="text-lg font-bold text-indigo-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-lg font-medium text-gray-700">
                      {item.qty} x Rs. {parsePrice(item.price).toLocaleString()} ={" "}
                      <span className="font-bold text-slate-900">
                        Rs. {(parsePrice(item.price) * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-slate-50 p-8 rounded-2xl shadow-lg border border-slate-200 sticky top-10">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-800 border-b pb-4">
              Order Summary
            </h2>

            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-semibold">
                  Rs. {itemsPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-semibold">
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    `Rs. ${shippingPrice.toLocaleString()}`
                  )}
                </span>
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="flex justify-between text-2xl font-extrabold text-indigo-700">
                <span>Total:</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0 || loading}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition transform mt-8 text-lg ${cart.cartItems.length === 0 ? "bg-gray-400 cursor-not-allowed text-gray-200" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:-translate-y-1"}`}
            >
              {loading ? "Processing... ⏳" : "Place Order 🚀"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;