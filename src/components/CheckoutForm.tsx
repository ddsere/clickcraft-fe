import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

interface CheckoutFormProps {
    orderId: string;
    amount: number;
    onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ orderId, amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return; 
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
            },
            redirect: 'if_required', 
        });

        if (error) {
            setMessage(error.message || 'An unexpected error occurred. 😢');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment successful! 🎉');
            
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                
                await axios.put(`/api/orders/${orderId}/pay`, {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: new Date().toISOString(),
                    email_address: userInfo?.email,
                }, config);

                onSuccess(); 
                
            } catch (err) {
                setMessage('Payment succeeded but failed to update the order system. Please contact support.');
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-gray-200 mt-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Pay with Card 💳</h3>
            
            <PaymentElement className="mb-6" />
            
            <button 
                disabled={isLoading || !stripe || !elements} 
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
                {isLoading ? 'Processing Payment... ⏳' : `Pay Rs. ${amount.toLocaleString()}`}
            </button>

            {message && (
                <div className={`mt-4 text-center font-bold p-3 rounded-lg ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckoutForm;