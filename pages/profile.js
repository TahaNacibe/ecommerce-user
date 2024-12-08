import { signIn, useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Key, LogOut } from 'lucide-react';
import OrderServices from './services/order_services';

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const [userOrders, setUserOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);

    const getTheTotalForTheOrder = (items) => {
        let orderTotal = 0;
        for (let item of items) {
            orderTotal += (item.price_data.unit_amount / 100) * item.quantity;
        }
        return orderTotal;
    };

    useEffect(() => {
        const getTheOrdersData = async () => {
            if (session?.user?.email) {
                try {
                    console.log("Fetching orders for:", session.user.email);
                    const response = await OrderServices.getUserOrdersHistory(session.user.email);
                    console.log("Orders Response:", response);

                    if (Array.isArray(response) && response.length > 0) {
                        setUserOrders(response);
                    } else {
                        console.log("No orders found or invalid response:", response);
                        setUserOrders([]);
                    }
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setIsLoading(false);
                }
            } else {
                console.error('Email is undefined');
                setIsLoading(false);
            }
        };

        if (session && status === 'authenticated') {
            getTheOrdersData();
        } else {
            console.log("Session not authenticated yet");
        }
    }, [session, status]);

    // Calculate total amount when orders change
    useEffect(() => {
        if (userOrders.length > 0) {
            const total = userOrders.reduce((total, order) => {
                return total + getTheTotalForTheOrder(order.line_items);
            }, 0);
            setTotalAmount(total);
        }
    }, [userOrders]); // Run whenever userOrders changes

    if (status === 'loading') {
        return (
            <div className='pt-20'>
                <h1>Loading session...</h1>
            </div>
        );
    }

    if (!session) {
        return (
            <div className='h-screen w-screen items-center flex justify-center flex-col gap-12 pt-20'>
                <img src='log_in.svg' className='w-1/2 h-1/2' alt='' />
                <div
                    onClick={() => signIn("google")}
                    className='rounded-lg bg-indigo-800 px-4 py-3 text-white flex gap-4 cursor-pointer'>
                    <Key />
                    <h1>Sign In To see profile</h1>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='pt-20'>
                <h1>Loading orders...</h1>
            </div>
        );
    }

    if (userOrders.length === 0) {
        return (
            <div className="pt-20">
                <h1>No orders found</h1>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className='flex justify-between items-center'>
                <div className="flex items-center mb-6">
                    <img src={session.user.image} alt="Profile Picture" className="rounded-full w-20 h-20 mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">{session.user.name}</h1>
                        <p className="text-gray-500">{session.user.email}</p>
                    </div>
                </div>
                <div
                    onClick={() => signOut()}
                    className='bg-red-700 rounded-lg px-4 py-3 flex gap-4 cursor-pointer text-white h-fit'>
                    <LogOut />
                    <h3>Log out</h3>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <h2 className="bg-gray-100 px-6 py-4 text-lg font-medium">Orders</h2>
                <div className="px-6 py-4">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left">Address</th>
                                <th className="px-4 py-3 text-left">phone</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map((order, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                    <td className="px-4 py-3 text-left">{order.address}</td>
                                    <td className="px-4 py-3 text-left">{order.phoneNumber}</td>
                                    <td className="px-4 py-3 text-left">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-right">${getTheTotalForTheOrder(order.line_items).toFixed(2)}</td>
                                    <td className={`px-4 py-3 text-right ${order.isPaid ? "text-green-900" : "text-orange-800"}`}>
                                        {order.isPaid ? "Paid" : "Not Paid"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-4">
                    <p>Total Orders: {userOrders.length}</p>
                    <p>Total Amount Spent: ${totalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
