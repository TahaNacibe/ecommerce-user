import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import ProductItem from "@/components/product_item";
import ProductsService from "./services/products_service";
import { useRouter } from "next/router";


// Custom Alert Component
const Alert = ({ children }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{children}</p>
      </div>
    </div>
  </div>
);

// Custom Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Filter Select Component with enhanced accessibility
const FilterSelect = ({ label, value, onChange, options, disabled }) => {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="relative">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          w-full px-3 py-2
          bg-white border border-gray-300 rounded-lg
          text-sm text-gray-900
          cursor-pointer
          appearance-none
          hover:border-gray-400 
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-6">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

// Product Skeleton Loading Component
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <Skeleton className="w-full h-48 rounded-lg mb-4" />
    <Skeleton className="w-3/4 h-4 mb-2" />
    <Skeleton className="w-1/2 h-4 mb-4" />
    <Skeleton className="w-1/4 h-8" />
  </div>
);

// Main Products Page Component
export default function ProductsPage({ initialProductsList }) {
    const router = useRouter();
    const { search } = router.query;
    
    // State management
    const [productsList, setProductsList] = useState(initialProductsList);
    const [searchQuery, setSearchQuery] = useState(search || "");
    const [orderBy, setOrderBy] = useState("newest");
    const [priceRange, setPriceRange] = useState("all");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter options
    const orderOptions = [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "name_asc", label: "Name: A to Z" },
        { value: "name_desc", label: "Name: Z to A" },
    ];

    const priceRangeOptions = [
        { value: "all", label: "All Prices" },
        { value: "under_100", label: "Under $100" },
        { value: "100_500", label: "$100 - $500" },
        { value: "500_1000", label: "$500 - $1000" },
        { value: "over_1000", label: "Over $1000" },
    ];

    // Fetch products data
    const getData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await ProductsService.getProducts(searchQuery);
            if (data) {
                setProductsList(data);
            }
        } catch (err) {
            setError("Failed to fetch products. Please try again later.");
            console.error("Error fetching products:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // Search handlers
    const handleSearchInput = (event) => {
        setSearchQuery(event.target.value);
    };

    const performSearch = () => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, search: searchQuery },
        }, undefined, { shallow: true });
        getData();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    };

    // Reset filters
    const handleResetFilters = () => {
        setOrderBy("newest");
        setPriceRange("all");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Search Section with enhanced accessibility */}
            <div className="relative bg-gradient-to-b from-black to-white py-28">
                <div className="absolute inset-0" />
                <div className="relative h-full flex flex-col items-center justify-center px-4 gap-8">
                    <h1 className="text-4xl md:text-6xl text-white font-bold text-center max-w-4xl">
                        Looking for something specific?
                        <span className="block mt-2 text-black">Try searching for it</span>
                    </h1>
                    <div className="w-full max-w-2xl relative">
                        <input
                            aria-label="Search products"
                            className="w-full h-14 px-6 rounded-xl
                                     bg-white/90 backdrop-blur-sm
                                     ring-1 ring-white/20
                                     text-lg placeholder:text-gray-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-400
                                     shadow-xl"
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearchInput}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            onClick={performSearch}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2
                                     p-3 rounded-lg bg-black
                                     text-white transition-all duration-200
                                     hover:bg-gray-900 active:scale-95
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error && <Alert>{error}</Alert>}
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="md:w-64 flex-shrink-0">
                        <div className="sticky top-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button 
                                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                                    aria-label={isFilterVisible ? "Hide filters" : "Show filters"}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <FilterSelect
                                    label="Sort By"
                                    value={orderBy}
                                    onChange={setOrderBy}
                                    options={orderOptions}
                                    disabled={isLoading}
                                />
                                <FilterSelect
                                    label="Price Range"
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    options={priceRangeOptions}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleResetFilters}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 text-sm text-blue-600 
                                             hover:bg-blue-50 rounded-lg transition-colors duration-200
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <DataDisplay 
                            productsList={productsList} 
                            searchQuery={search}
                            orderBy={orderBy}
                            priceRange={priceRange}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Data Display Component with loading state
const DataDisplay = ({ productsList, searchQuery, orderBy, priceRange, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <ProductSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (!productsList || productsList.length === 0) {
        return <NoResultWidget />;
    }

    // Filter and sort products based on selected options
    let filteredProducts = [...productsList];

    // Apply price range filter
    if (priceRange !== "all") {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.isInDiscount? product.discountPrice : product.price;
            switch (priceRange) {
                case "under_100":
                    return price < 100;
                case "100_500":
                    return price >= 100 && price <= 500;
                case "500_1000":
                    return price >= 500 && price <= 1000;
                case "over_1000":
                    return price > 1000;
                default:
                    return true;
            }
        });
    }

    // Apply sorting with proper locale support
    filteredProducts.sort((a, b) => {
        switch (orderBy) {
            case "price_asc":
                return (a.isInDiscount? a.discountPrice : a.price)  - (b.isInDiscount? b.discountPrice : b.price);
            case "price_desc":
                return (b.isInDiscount? b.discountPrice : b.price) - (a.isInDiscount? a.discountPrice : a.price);
            case "name_asc":
                return a.title.localeCompare(b.title);
            case "name_desc":
                return b.title.localeCompare(a.title);
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "newest":
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-black rounded-full" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        {searchQuery ? `Search results for '${searchQuery}'` : "All Products"}
                    </h2>
                </div>
                <span className="text-sm text-gray-500">
                    {filteredProducts.length} products found
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                    <ProductItem
                        key={`${product._id}-${index}`}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};

// No Results Component with enhanced UI
function NoResultWidget() {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 px-4">
            <img 
                src='/nothing.svg' 
                alt='No products found' 
                className="w-64 h-64 mb-8 opacity-75" 
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No Products Found
            </h3>
            <p className="text-gray-600 text-center max-w-md">
                Try adjusting your filters or search terms to find what you're looking for.
            </p>
        </div>
    );
}