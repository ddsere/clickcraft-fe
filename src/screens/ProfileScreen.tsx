import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";

const ProfileScreen: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get("/api/orders/myorders", config);
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  return (
        <div className="max-w-7xl mx-auto mt-10 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
                
                <div className="lg:w-1/3 xl:w-1/4 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-4">
                                👤
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-800">{userInfo?.name}</h2>
                            <p className="text-gray-500">{userInfo?.email}</p>
                            
                            <span className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                userInfo?.role === "admin" ? "bg-red-100 text-red-700" : 
                                userInfo?.role === "seller" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            }`}>
                                {userInfo?.role || "Customer"}
                            </span>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            {userInfo?.role === "customer" && (
                                <Link to="/become-seller" className="flex items-center justify-center bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                                    🚀 Become a Seller
                                </Link>
                            )}
                            {(userInfo?.role === "seller" || userInfo?.role === "admin") && (
                                <Link to="/seller-dashboard" className="flex items-center justify-center bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                                    📊 Seller Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:w-2/3 xl:w-3/4">
                    <h2 className="text-3xl font-extrabold mb-6 text-slate-800">My Orders</h2>
                    
                    {loading ? (
                        <div className="text-center py-20 text-xl font-bold text-gray-500">Loading Orders... ⏳</div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-200 p-12 rounded-3xl text-center">
                            <p className="text-xl text-gray-400 mb-4">No orders placed yet.</p>
                            <Link to="/" className="text-indigo-600 font-bold hover:underline">Start Shopping →</Link>
                        </div>
                    ) : (
                        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="p-5 font-bold text-slate-600">ID</th>
                                            <th className="p-5 font-bold text-slate-600">Date</th>
                                            <th className="p-5 font-bold text-slate-600">Total</th>
                                            <th className="p-5 font-bold text-slate-600">Paid</th>
                                            <th className="p-5 font-bold text-slate-600">Status</th>
                                            <th className="p-5 font-bold text-slate-600 text-center">View</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-slate-50 transition">
                                                <td className="p-5 font-mono text-sm text-gray-500">#{order._id.substring(0, 8)}</td>
                                                <td className="p-5 text-gray-700">{order.createdAt.substring(0, 10)}</td>
                                                <td className="p-5 font-bold text-indigo-600">Rs. {order.totalPrice.toLocaleString()}</td>
                                                <td className="p-5">
                                                    {order.isPaid ? <span className="text-green-600 font-bold text-sm">✅ Paid</span> : <span className="text-red-400 font-bold text-sm">✕ Pending</span>}
                                                </td>
                                                <td className="p-5">
                                                    {order.isDelivered ? <span className="text-green-600 font-bold text-sm">🚚 Delivered</span> : <span className="text-amber-500 font-bold text-sm">⏳ Processing</span>}
                                                </td>
                                                <td className="p-5 text-center">
                                                    <Link to={`/order/${order._id}`} className="text-indigo-600 font-bold hover:underline">Details</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
