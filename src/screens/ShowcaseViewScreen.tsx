import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

interface ProductItem {
    _id?: string;
    name: string;
    price: string;
    desc: string;
    image?: string;
}

interface ShowcaseData {
    title: string;
    theme: string;
    user: { 
        _id: string;          
        name: string; 
        businessName?: string;
        email?: string;
    };
    items: ProductItem[];
}

const ShowcaseViewScreen: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const [showcase, setShowcase] = useState<ShowcaseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const addToCartHandler = (item: any) => {
        if (showcase && showcase.user) {
            dispatch(addToCart({
                _id: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                qty: 1,
                sellerId: showcase.user._id 
            }));
            
            //navigate('/cart');
        }
    };

    useEffect(() => {
        const fetchShowcase = async () => {
            try {
                const res = await axios.get(`/api/showcases/${slug}`);
                setShowcase(res.data);
            } catch (err: any) {
                setError("Couldn't find the Showcase!");
            } finally {
                setLoading(false);
            }
        };

        fetchShowcase();
    }, [slug]);

    if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Showcase... ⏳</div>;
    if (error) return <div className="text-center mt-20 text-red-600 font-bold text-xl">{error}</div>;
    if (!showcase) return null;

    return (
        <div className={`min-h-[85vh] ${showcase.theme} py-12 px-4 transition-all duration-500`}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
                        {showcase.title}
                    </h1>
                    <p className="text-lg opacity-80">
                        Curated by <span className="font-semibold text-indigo-400">
                            {showcase.user.businessName || showcase.user.name}
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {showcase.items.map((item, index) => (
                        <div key={item._id || index} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition flex flex-col h-full">
                            
                            {item.image && (
                                <div className="w-full flex justify-center mb-6">
                                    <img src={item.image} alt={item.name} className="rounded-lg shadow-md object-cover w-full h-64" />
                                </div>
                            )}
                            
                            <div className="flex-grow flex flex-col justify-between text-left">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                                        <span className="bg-indigo-600 text-white px-4 py-1 rounded-full font-bold text-lg shadow-md whitespace-nowrap ml-4">
                                            Rs. {item.price}
                                        </span>
                                    </div>
                                    <p className="text-gray-200 text-base leading-relaxed mb-6">
                                        ✨ {item.desc}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => addToCartHandler(item)}
                                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg mt-auto"
                                >
                                    Add to Cart 🛒
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/" className="text-indigo-300 hover:text-white underline font-medium">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShowcaseViewScreen;