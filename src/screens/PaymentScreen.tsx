import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { savePaymentMethod } from '../store/slices/cartSlice';

const PaymentScreen: React.FC = () => {
    const [paymentMethod] = useState('Credit/Debit Card');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state: RootState) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress || !shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
                <span className="text-5xl">🔒</span>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-4">Payment Method</h1>
                <p className="text-gray-500 mt-2">All transactions are secure and encrypted.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-4">Select Payment Option</label>
                    
                    <div className="bg-indigo-50 border-2 border-indigo-500 p-5 rounded-xl flex items-center shadow-sm cursor-pointer transition transform hover:-translate-y-1">
                        <input 
                            type="radio" 
                            id="card" 
                            name="paymentMethod" 
                            value="Credit/Debit Card" 
                            checked 
                            readOnly
                            className="w-6 h-6 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="card" className="ml-4 text-lg font-bold text-indigo-900 flex items-center w-full cursor-pointer">
                            💳 Credit / Debit Card
                            <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1">
                                <span>✓</span> Secure
                            </span>
                        </label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:from-black hover:to-black transition transform hover:-translate-y-1 text-lg flex justify-center items-center gap-2 mt-8"
                >
                    Continue to Review Order &rarr;
                </button>
            </form>
        </div>
    );
};

export default PaymentScreen;