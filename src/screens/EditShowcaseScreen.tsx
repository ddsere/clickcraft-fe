import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";

const EditShowcaseScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("bg-slate-900");
  const [items, setItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  const generateDescriptionHandler = async (index: number) => {
    const productName = items[index].name;

    if (!productName) {
      alert("Please enter a Product Name first to generate a description! 🏷️");
      return;
    }

    setGeneratingIndex(index);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const { data } = await axios.post(
        "/api/ai/generate-desc",
        { productName },
        config,
      );

      handleItemChange(index, "desc", data.description || data);
    } catch (err: any) {
      alert(
        "Failed to generate description. Please check your connection or AI route.",
      );
    } finally {
      setGeneratingIndex(null);
    }
  };

  const uploadFileHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploadingImageIndex(index);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      handleItemChange(index, "image", data.image || data);
    } catch (err: any) {
      alert("Image upload failed! Please try again.");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  useEffect(() => {
    if (
      !userInfo ||
      (userInfo.role !== "seller" && userInfo.role !== "admin")
    ) {
      navigate("/profile");
      return;
    }

    const fetchShowcase = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await axios.get("/api/showcases/myshowcases", config);
        const currentShowcase = data.find((s: any) => s._id === id);

        if (currentShowcase) {
          setTitle(currentShowcase.title);
          setTheme(currentShowcase.theme);
          setItems(currentShowcase.items || []);
        } else {
          setError("Showcase not found or you are not authorized to edit it.");
        }
      } catch (err: any) {
        setError("Failed to load showcase data.");
      } finally {
        setLoading(false);
      }
    };

    fetchShowcase();
  }, [id, userInfo, navigate]);

  const handleAddItem = () =>
    setItems([
      ...items,
      {
        name: "",
        price: "",
        desc: "",
        image: "",
        category: "Electronics & Tech",
      },
    ]);
    
  const handleRemoveItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));
    
  const handleItemChange = (
    index: number,
    field: "name" | "price" | "desc" | "image" | "category",
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`/api/showcases/${id}`, { title, theme, items }, config);

      alert("Showcase updated successfully! 🎉");
      navigate("/seller-dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update showcase");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="text-xl font-bold text-center mt-20">
        Loading Showcase Details... ⏳
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-200 max-w-4xl mx-auto mt-10 text-center font-bold">
        {error}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6 border-b pb-4">
        ✏️ Edit Showcase
      </h1>

      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Showcase Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="E.g. Brixo Mega Gaming Sale"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Theme Color
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="bg-slate-900">Dark Slate</option>
            <option value="bg-indigo-900">Deep Indigo</option>
            <option value="bg-purple-900">Royal Purple</option>
            <option value="bg-emerald-900">Emerald Green</option>
            <option value="bg-rose-900">Rose Red</option>
          </select>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Products ({items.length})
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-200 transition"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ✕
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 text-sm">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 text-sm">
                      Price
                    </label>
                    <input
                      type="text"
                      required
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Rs. 5000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1 text-sm">
                      Category
                    </label>
                    <select
                      required
                      value={item.category || "Electronics & Tech"}
                      onChange={(e) =>
                        handleItemChange(index, "category", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="Electronics & Tech">💻 Electronics & Tech</option>
                      <option value="Fashion & Clothing">👕 Fashion & Clothing</option>
                      <option value="Home & Lifestyle">🛋️ Home & Lifestyle</option>
                      <option value="Automotive & Parts">⚙️ Automotive & Parts</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-700 font-bold text-sm">
                        Description
                      </label>

                      <button
                        type="button"
                        onClick={() => generateDescriptionHandler(index)}
                        disabled={generatingIndex === index}
                        className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold py-1.5 px-3 rounded-full transition flex items-center gap-1 shadow-sm border border-purple-200"
                      >
                        {generatingIndex === index
                          ? "Generating... ⏳"
                          : "✨ Generate with AI"}
                      </button>
                    </div>

                    <textarea
                      required
                      value={item.desc}
                      onChange={(e) =>
                        handleItemChange(index, "desc", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      rows={3}
                      placeholder="Write an attractive description or use AI to generate one..."
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-gray-700 font-bold mb-2 text-sm">
                      Product Image
                    </label>
                    <div className="flex flex-col gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Product Preview"
                          className="h-24 w-24 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                      )}

                      <input
                        type="file"
                        onChange={(e) => uploadFileHandler(e, index)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                      />

                      {uploadingImageIndex === index && (
                        <span className="text-sm text-indigo-600 font-bold animate-pulse">
                          Uploading Image... ⏳
                        </span>
                      )}

                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) =>
                          handleItemChange(index, "image", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500 bg-gray-50 mt-1"
                        placeholder="Or enter image URL directly"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition mt-8 text-lg flex justify-center items-center gap-2"
        >
          {updating ? "Saving Changes... ⏳" : "Save Changes ✅"}
        </button>
      </form>
    </div>
  );
};

export default EditShowcaseScreen;