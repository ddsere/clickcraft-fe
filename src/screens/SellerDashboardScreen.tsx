import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

const SellerDashboardScreen: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [showcases, setShowcases] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || (userInfo.role !== 'seller' && userInfo.role !== 'admin')) {
            navigate('/profile');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                
                const { data: ordersData } = await axios.get('/api/orders/seller-orders', config);
                setOrders(ordersData);

                const { data: showcasesData } = await axios.get('/api/showcases/myshowcases', config);
                setShowcases(showcasesData);

            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userInfo, navigate]);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this showcase? This cannot be undone! ⚠️')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/showcases/${id}`, config);
                
                setShowcases(showcases.filter((showcase) => showcase._id !== id));
                alert('Showcase deleted successfully! 🗑️');
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete showcase');
            }
        }
    };

    if (loading) return <div className="text-xl font-bold text-center mt-20">Loading Dashboard... ⏳</div>;
    if (error) return <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-200 max-w-4xl mx-auto mt-10 text-center">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 space-y-16">
            
            <section>
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">🏪 My Orders</h1>
                        <p className="text-gray-500 mt-1">Manage the orders you received.</p>
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-bold shadow-sm">
                        Total Orders: {orders.length}
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-indigo-50 text-indigo-800 p-8 rounded-2xl text-center shadow-sm border border-indigo-100">
                        <span className="text-4xl block mb-4">📭</span>
                        <h2 className="text-xl font-bold mb-2">No orders yet!</h2>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-white">
                                        <th className="p-4 font-semibold text-sm">Order ID</th>
                                        <th className="p-4 font-semibold text-sm">Customer</th>
                                        <th className="p-4 font-semibold text-sm">Date</th>
                                        <th className="p-4 font-semibold text-sm">Total</th>
                                        <th className="p-4 font-semibold text-sm">Paid</th>
                                        <th className="p-4 font-semibold text-sm">Delivered</th>
                                        <th className="p-4 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-sm font-medium text-gray-700">{order._id.substring(0, 8)}...</td>
                                            <td className="p-4 text-sm font-bold text-indigo-600">{order.user ? order.user.name : 'Unknown'}</td>
                                            <td className="p-4 text-sm text-gray-600">{order.createdAt.substring(0, 10)}</td>
                                            <td className="p-4 text-sm font-bold text-slate-800">Rs. {order.totalPrice.toLocaleString()}</td>
                                            <td className="p-4 text-sm">
                                                {order.isPaid ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {order.isDelivered ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <Link to={`/order/${order._id}`} className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-indigo-700">View</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">✨ My Showcases</h1>
                        <p className="text-gray-500 mt-1">Manage and edit your product showcases.</p>
                    </div>
                    <Link to="/create-showcase" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition">
                        + New Showcase
                    </Link>
                </div>

                {showcases.length === 0 ? (
                    <div className="bg-blue-50 text-blue-800 p-8 rounded-2xl text-center shadow-sm border border-blue-100">
                        <span className="text-4xl block mb-4">🖼️</span>
                        <h2 className="text-xl font-bold mb-2">You haven't created any showcases yet.</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {showcases.map((showcase) => (
                            <div key={showcase._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                                <div className={`h-32 ${showcase.theme || 'bg-slate-800'} flex items-center justify-center`}>
                                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{showcase.title}</h3>
                                </div>
                                <div className="p-5 flex-grow">
                                    <p className="text-gray-600 font-medium mb-2">Slug: <span className="text-indigo-500">/{showcase.slug}</span></p>
                                    <p className="text-gray-600 font-medium">Items: <span className="font-bold text-slate-800">{showcase.items?.length || 0}</span></p>
                                </div>
                                <div className="p-5 border-t border-gray-100 flex gap-3">
                                    <Link 
                                        to={`/edit-showcase/${showcase._id}`} 
                                        className="flex-1 bg-yellow-500 text-white text-center py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
                                    >
                                        Edit ✏️
                                    </Link>
                                    <button 
                                        onClick={() => deleteHandler(showcase._id)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition"
                                    >
                                        Delete 🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default SellerDashboardScreen;