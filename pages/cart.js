import { CartContext } from "@/components/cart/CartContext";
import { useContext, useEffect, useState } from "react";
import ProductsService from "./services/products_service";
import { Plus, Minus, Trash2, X, CircleCheck, CircleX} from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function UserCartPage() {
    const { data: session } = useSession()
    // Managing the page vars
    const [products, setProducts] = useState([]);
    const [loading, setLoadingState] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [alertStack, setAlertStack] = useState({
        message: "",
        visible: false,
        status: null,
        title: ""
    });
    
    const [userDetails, setUserDetails] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        country:"",
        city: "",
        email:"",
        postalCode: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        country:"",
        city: "",
        email:"",
        postalCode: ""
    });

    // Get all the functions from the provider
    const { 
        cartProducts, 
        setCartProducts, 
        isProductInTheCart, 
        changeProductStateInCart, 
        removeProductFromCart 
    } = useContext(CartContext);

    // Load saved user details on mount
    useEffect(() => {
        const savedDetails = localStorage.getItem('userDetails');
        if (savedDetails) {
            setUserDetails(JSON.parse(savedDetails));
        }
    }, []);

    // Get the user cart data
    useEffect(() => {
        const getUserProductsList = async () => {
            const uniqIds = [...new Set(cartProducts)];
            const response = await ProductsService.getTheUserCartProductsList(uniqIds);
            if (response && response.length > 0) {
                setProducts(response);
            }
            setLoadingState(false);
        };

        getUserProductsList();
    }, [cartProducts]);

    // Calculate product count in cart
    const getProductCount = (productId) => {
        return cartProducts.filter(id => id === productId).length;
    };

    // Handle quantity changes
    const handleIncrement = (productId) => {
        changeProductStateInCart(productId, true);
    };

    const handleDecrement = (productId) => {
        changeProductStateInCart(productId, false);
    };

    // Enhanced user details handler with validation
    const handleUserDetailsChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => {
            const newDetails = {
                ...prev,
                [name]: value
            };
            localStorage.setItem('userDetails', JSON.stringify(newDetails));
            return newDetails;
        });

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    // Calculate total price
    const calculateTotal = () => {
        return products.reduce((total, product) => {
            return total + ((product.isInDiscount ? product.discountPrice ?? product.price : product.price) * getProductCount(product._id));
        }, 0);
    };

    // Calculate each row price
    const calculateEachItemTotal = (product) => {
        return (product.isInDiscount ? product.discountPrice ?? product.price : product.price) * getProductCount(product._id);
    };

    //* check out
    const checkOut = async () => {
        const senderEmail = session.user.email
        const response = await axios.post("api/checkout", {
            ...userDetails, cartProducts, senderEmail
        })

        if (response.data.url) {
            window.location = response.data.url
        }
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!userDetails.name.trim()) newErrors.name = "Name is required";
        if (!userDetails.address.trim()) newErrors.address = "Address is required";
        if (!userDetails.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!userDetails.city.trim()) newErrors.city = "City is required";
        if (!userDetails.postalCode) newErrors.postalCode = "Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Close the alert widget
    const closeAlertWidget = () => {
        setAlertStack({
            message: "",
            status: null,
            visible: false,
            title: ""
        });
    };

    // Handle remove product
    const handleRemoveProduct = (productId) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            removeProductFromCart(productId);
        }
    };

    // Alert Widget Component
    const AlertWidget = () => {
        if (alertStack.visible) {
            return (
                <div 
                    className={`flex flex-col gap-1 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-200 
                        ${alertStack.status 
                            ? "bg-gradient-to-r from-indigo-400 to-indigo-500 text-white" 
                            : "bg-gradient-to-r from-red-400 to-red-500 text-white"}`}
                >
                    <h3 className="font-semibold">
                        {alertStack.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-white/90">
                            {alertStack.message}
                        </p>
                        <button 
                            onClick={closeAlertWidget}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors ml-4"
                            aria-label="Close alert"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Handle the continue payment action
    const continuePayment = async () => {
        if (!validateForm()) {
            setAlertStack({
                title: "Missing information",
                status: false,
                visible: true,
                message: "Please fill in all required fields correctly"
            });
            return;
        }

        setProcessingPayment(true);
        try {
            checkOut()
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAlertStack({
                title: "Purchase was completed",
                status: true,
                visible: true,
                message: "Your product will be delivered soon, please check your email as some updates will be sent soon"
            });
        } catch (error) {
            setAlertStack({
                title: "Error",
                status: false,
                visible: true,
                message: "There was an error processing your payment. Please try again."
            });
        } finally {
            setProcessingPayment(false);
        }
    };

    // Price Widget Component
    const PriceWidget = ({isInDiscount, price, discount}) => {
        return (
            <div>
                {isInDiscount ? (
                    <span className="flex flex-col">
                        <span className="line-through text-gray-500">
                            ${price}
                        </span>
                        ${discount}
                    </span>
                ) : (
                    <span>${price}</span>
                )}
            </div>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (window.location.href.includes("success")) {
        return (
            <div className="h-screen pt-20 bg-white gap-4 flex items-center w-full px-20 justify-center flex-col">
                <CircleCheck size={90} className="text-green-700" />
                <h1 className="text-3xl">
                    Payment completed,  please check your email as updates will be sent soon
                </h1>
            </div>
        )
    }

    if (window.location.href.includes("canceled")) {
        return (
            <div className="h-screen pt-20 bg-white gap-4 flex items-center w-full px-20 justify-center flex-col">
                <CircleX size={90} className="text-red-700" />
                <h1 className="text-3xl">
                    Payment Canceled,  the payment process was canceled
                </h1>
            </div>
        )
    }

    if (products.length === 0 || cartProducts.length === 0) {
        return (
            <div className="items-center flex justify-items-center justify-center h-screen">
                <img src='empty_cart.svg' className="h-1/3 w-1/3" alt='Empty cart'/>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <AlertWidget />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Products Table */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-4 text-left">Product</th>
                                    <th className="p-4 text-left">Quantity</th>
                                    <th className="p-4 text-left">Price</th>
                                    <th className="p-4 text-left">Total</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.title} 
                                                    className="w-16 h-16 object-cover mr-4 border rounded-lg p-1"
                                                />
                                                <span>{product.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleDecrement(product._id)}
                                                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span>{getProductCount(product._id)}</span>
                                                <button 
                                                    onClick={() => handleIncrement(product._id)}
                                                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <PriceWidget 
                                                isInDiscount={product.isInDiscount} 
                                                price={product.price} 
                                                discount={product.discountPrice} 
                                            />
                                        </td>
                                        <td className="p-4">
                                            <span>${calculateEachItemTotal(product)}</span>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleRemoveProduct(product._id)}
                                                className="p-1 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Details and Checkout */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Order Details</h3>
                        <div className="space-y-4" >
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userDetails.name}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={userDetails.address}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : ''}`}
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={userDetails.phoneNumber}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userDetails.email}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={userDetails.country}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.country ? 'border-red-500' : ''}`}
                                />
                                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={userDetails.city}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : ''}`}
                                />
                                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Postal Code *</label>
                                <input
                                    type="number"
                                    name="postalCode"
                                    value={userDetails.postalCode}
                                    onChange={handleUserDetailsChange}
                                    className={`w-full p-2 border rounded ${errors.postalCode ? 'border-red-500' : ''}`}
                                />
                                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Total:</span>
                                    <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <button 
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    onClick={continuePayment}
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? 'Processing...' : 'Continue to Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}