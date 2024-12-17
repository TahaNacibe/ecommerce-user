class ProductsService {
    //* get products on search
    async getProducts(searchQuery = "") {
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
    async getProductsByCategoriesFilter(categories = []) {
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
    async getTheUserCartProductsList(ids = []) {
        try {
            const queryString = ids.length > 0 ? `${encodeURIComponent(ids.join(","))}` : "";
            const response = await fetch(`/api/getCartProducts?productsIds=${queryString}`)
            const result = await response.json()
            return result
        } catch (error) {
            throw error
        }
    }
}

export default ProductsService;