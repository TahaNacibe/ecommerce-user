class ProductsService {
    //* get products on search
    static async getProducts(searchQuery = "") {
        try {
            const response = await fetch(`/api/fetchData?searchQuery=${searchQuery}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("ProductsService getProducts error:", error);
            throw error;
        }
    }

    //* get products with categories
    static async getProductsByCategoriesFilter(categories = []) {
        try {
            const response = await fetch(`/api/getProductsByCategory?categories=${categories.join("_")}`)
            const result = await response.json()
            return result
        } catch (error) {
            console.error("error happened when fetching products with category: ", error)
            throw error
        }
    }


    //* get products for cart
    static async getTheUserCartProductsList(ids = []) {
        try {
            const queryString = ids.length > 0 ? `${encodeURIComponent(ids.join(","))}` : "";
            const response = await fetch(`/api/getCartProducts?productsIds=${queryString}`)
            const result = await response.json()
            console.log("response is from server", response)
            return result
        } catch (error) {
            console.error("error happened when fetching products for user carts: ", error)
            throw error
        }
    }
}

export default ProductsService;