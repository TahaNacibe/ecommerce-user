import axios from "axios";

export default class OrderServices{

    // Updated axios request to send ownerEmail as a query parameter
    static getUserOrdersHistory = async (ownerEmail) => {
    try {
        const response = await axios.get(`api/fetch_orders?ownerEmail=${ownerEmail}`);
        return response.data;  // Ensure we return only the data part of the response
    } catch (error) {
        console.error("ProductsService getProducts error:", error);
        throw error;
    }
};

}