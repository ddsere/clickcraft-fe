import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { type RootState } from '../store/store';
import { setCredentials } from '../store/slices/authSlice'; 

const BecomeSellerScreen: React.FC = () => {
    const [businessName, setBusinessName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userInfo && (userInfo.role === 'seller' || userInfo.role === 'admin')) {
            navigate('/profile');
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(
                '/api/users/upgrade-seller',
                { businessName, phoneNumber },
                config
            );

            dispatch(setCredentials(data));

            alert('Congratulations! 🎉 You are now a Seller on ClickCraft.');
            navigate('/profile'); 
            
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upgrade account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
                <span className="text-5xl">🏪</span>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-4">Become a Seller</h1>
                <p className="text-gray-500 mt-2">Start selling your products to millions of customers!</p>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Business / Store Name</label>
                    <input 
                        type="text" 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        required 
                        placeholder="Ex: Brixo Computers" 
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Contact Number</label>
                    <input 
                        type="text" 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                        placeholder="Ex: 077 123 4567" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:-translate-y-1 text-lg"
                >
                    {loading ? 'Processing... ⏳' : 'Upgrade to Seller 🚀'}
                </button>
            </form>
        </div>
    );
};

export default BecomeSellerScreen;