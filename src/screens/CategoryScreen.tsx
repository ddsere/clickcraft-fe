import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CategoryScreen: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>(); 
    
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItemsByCategory = async () => {
            try {
                const { data } = await axios.get('/api/showcases');
                
                let items: any[] = [];
                data.forEach((showcase: any) => {
                    if (showcase.items && showcase.items.length > 0) {
                        const matchingItems = showcase.items.filter((item: any) => item.category === categoryName);
                        
                        const itemsWithContext = matchingItems.map((item: any) => ({
                            ...item,
                            showcaseTitle: showcase.title,
                            showcaseSlug: showcase.slug,
                            sellerName: showcase.user?.businessName || showcase.user?.name || 'Unknown Seller'
                        }));
                        
                        items = [...items, ...itemsWithContext];
                    }
                });

                setFilteredItems(items);
            } catch (err: any) {
                setError('Failed to load category items.');
            } finally {
                setLoading(false);
            }
        };

        fetchItemsByCategory();
    }, [categoryName]);

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 min-h-screen">
            <div className="bg-slate-900 rounded-3xl p-8 mb-10 text-center shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                    {categoryName}
                </h1>
                <p className="text-gray-400 text-lg">Explore the best products in this category</p>
            </div>

            {loading ? (
                <div className="text-xl font-bold text-center mt-20">Loading Products... ⏳</div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center font-bold max-w-2xl mx-auto">{error}</div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20">
                    <span className="text-6xl block mb-4">📭</span>
                    <h2 className="text-2xl font-bold text-slate-800">No products found in this category yet.</h2>
                    <p className="text-gray-500 mt-2">Check back later or explore other categories!</p>
                    <Link to="/" className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                        &larr; Back to Home
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {filteredItems.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col transform hover:-translate-y-1 hover:shadow-xl transition duration-300">
                            {/* Product Image */}
                            <div className="h-48 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-full object-contain" />
                                ) : (
                                    <span className="text-4xl">📦</span>
                                )}
                            </div>
                            
                            <div className="p-5 flex-grow flex flex-col">
                                <h3 className="font-extrabold text-lg text-slate-800 mb-1 line-clamp-1" title={item.name}>{item.name}</h3>
                                <p className="text-indigo-600 font-black text-xl mb-3">{item.price}</p>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{item.desc}</p>
                                
                                <div className="border-t border-gray-100 pt-4 mt-auto">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Sold in Showcase:</p>
                                    <Link 
                                        to={`/showcase/${item.showcaseSlug}`}
                                        className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold text-sm text-center block hover:bg-slate-800 transition shadow-sm"
                                    >
                                        Visit {item.sellerName}'s Shop &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryScreen;