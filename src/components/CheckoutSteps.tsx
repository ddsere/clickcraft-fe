import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutStepsProps {
    step1?: boolean;
    step2?: boolean;
    step3?: boolean;
    step4?: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ step1, step2, step3, step4 }) => {
    return (
        <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8 mt-4">
            {step1 ? (
                <Link to="/login" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Sign In</Link>
            ) : (
                <span className="text-gray-400 cursor-not-allowed pb-1">Sign In</span>
            )}
            <span className="text-gray-400">{' > '}</span>

            {step2 ? (
                <Link to="/shipping" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Shipping</Link>
            ) : (
                <span className="text-gray-400 cursor-not-allowed pb-1">Shipping</span>
            )}
            <span className="text-gray-400">{' > '}</span>

            {step3 ? (
                <Link to="/payment" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Payment</Link>
            ) : (
                <span className="text-gray-400 cursor-not-allowed pb-1">Payment</span>
            )}
            <span className="text-gray-400">{' > '}</span>

            {step4 ? (
                <Link to="/placeorder" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Place Order</Link>
            ) : (
                <span className="text-gray-400 cursor-not-allowed pb-1">Place Order</span>
            )}
        </div>
    );
};

export default CheckoutSteps;