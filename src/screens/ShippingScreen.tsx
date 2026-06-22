import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { saveShippingAddress } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen: React.FC = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || 'Sri Lanka');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
            <CheckoutSteps step1 step2 />

            <h1 className="text-4xl font-extrabold mb-8 text-center text-slate-800">
                Shipping Address 🚚
            </h1>

            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        placeholder="Ex: 123/A, Main Street" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            required 
                            placeholder="Ex: Colombo" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition" 
                            value={postalCode} 
                            onChange={(e) => setPostalCode(e.target.value)} 
                            required 
                            placeholder="Ex: 00100" 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Country</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition bg-gray-50" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 text-lg mt-8"
                >
                    Continue to Payment
                </button>
            </form>
        </div>
    );
};

export default ShippingScreen;