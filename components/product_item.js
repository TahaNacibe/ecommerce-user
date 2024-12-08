import React from 'react';
import { useContext } from 'react';
import { CartContext } from './cart/CartContext';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Main component that renders a product item with its details
export default function ProductItem({ product }) {

  // Determine if the product has a discount and calculate the discount percentage
  const hasDiscount = product.isInDiscount;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`product/${product._id.toString()}`}
      className="group relative rounded-xl px-4 py-2 bg-white shadow-md hover:shadow-xl transition-all duration-300">
      {/* Wishlist button overlay */}
      
      {/* Product image and any discount/new badges */}
      <ProductImage product={product} hasDiscount={hasDiscount} discountPercentage={discountPercentage} />
      
      {/* Product details section (category, title, rating, price, stock, etc.) */}
      <ProductDetails product={product} hasDiscount={hasDiscount} />
    </Link>
  );
}

// Wishlist button component (appears on hover)
function WishlistButton() {
  const { data: session, status } = useSession();
  const changeFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
  }


  return (
    <button
      onClick={(e) => changeFavorite(e)}
      className="absolute right-6 top-6 z-10 rounded-full bg-white p-2 opacity-0 shadow-md 
                      group-hover:opacity-100 transition-opacity hover:bg-gray-100">
      <Heart className="h-5 w-5 text-gray-600" />
    </button>
  );
}

// Product image component with discount and new badges
function ProductImage({ product, hasDiscount, discountPercentage }) {
  return (
    <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
      {/* Product image with hover effect */}
      <img
        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500 ease-out"
        src={product.image}
        alt={product.title}
      />
      
      {/* Display discount badge if the product is on sale */}
      {hasDiscount && <DiscountBadge discountPercentage={discountPercentage} />}
      
      {/* Display 'New' badge if the product is marked as new */}
      {product.isNew && <NewBadge />}
    </div>
  );
}

// Discount badge component to show the percentage off
function DiscountBadge({ discountPercentage }) {
  return (
    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg animate-pulse">
      SAVE {discountPercentage}%
    </div>
  );
}

// 'New' badge component to show if the product is new
function NewBadge() {
  return (
    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
      NEW
    </div>
  );
}

// Product details component, includes category, title, rating, price, stock, and add to cart button
function ProductDetails({ product, hasDiscount }) {

  //* ui tree
  return (
    <div className="space-y-3">
      {/* Category label */}
      <CategoryLabel category={product.category} />
      
      {/* Product title */}
      <Title title={product.title} />
      
      {/* Rating display */}
      {/* <Rating rating={product.rating} /> */}
      
      {/* Price section with original and discounted price (if applicable) */}
      <Price product={product} hasDiscount={hasDiscount} />
      
      {/* Stock status (e.g., low stock warning) */}
      <StockStatus stock={product.stock} />
      
      {/* Add to cart button */}
      <AddToCartButton productId={product._id} />
    </div>
  );
}

// Component for displaying the product's category
function CategoryLabel({ category }) {
  return (
    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {category}
    </div>
  );
}

// Component for displaying the product's title
function Title({ title }) {
  return (
    <h3 className="font-semibold text-gray-800 truncate text-lg">
      {title}
    </h3>
  );
}

// Component for displaying product's rating as stars
function Rating({ rating }) {
  return (
    <div className="flex items-center space-x-1">
      {/* Map over five stars, filling in stars based on rating */}
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < (rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
      {/* Display number of reviews if available */}
      {rating && (
        <span className="text-sm text-gray-500 ml-2">
          ({rating} reviews)
        </span>
      )}
    </div>
  );
}

// Component for displaying price (with discount if applicable)
function Price({ product, hasDiscount }) {
  return (
    <div className="flex items-center space-x-2">
      {/* Discounted price display */}
      {hasDiscount ? (
        <>
          <span className="text-xl font-bold text-gray-900">
            {Number(product.discountPrice) > 0 ? "$" + product.discountPrice.toFixed(2) : "Free"}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {Number(product.price) > 0 ? "$" + product.price.toFixed(2) : "Free"}
          </span>
        </>
      ) : (
        // Regular price display if no discount
        <span className="text-xl font-bold text-gray-900">
          {Number(product.price) > 0 ? "$" + product.price.toFixed(2) : "Free"}
        </span>
      )}
    </div>
  );
}

// Component to display stock status (e.g., low stock warning)
function StockStatus({ stock }) {
  return stock <= 5 && stock > 0 ? (
    <div className="text-sm text-orange-600 font-medium">
      Only {stock} left in stock
    </div>
  ) : null;
}

// Add to cart button component
function AddToCartButton(productId) {
  //* provider data (or that only a flutter thing (?u0))
  const { isProductInTheCart, changeProductStateInCart } = useContext(CartContext)
  const isInCart = isProductInTheCart(productId)

  //* function
  const handleButton = (e) => {
    e.stopPropagation();
    e.preventDefault();
    changeProductStateInCart(productId)
  }

  //* ui tree
  return (
    <button
      onClick={(e) => handleButton(e) }
      className={`
        w-full hover:bg-gray-950 text-white py-3 px-4 rounded-lg
                 flex items-center justify-center space-x-2 transition-all duration-300
                 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg ${isInCart? "bg-gray-600" : "bg-black"}
        `}
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="font-medium">{isInCart? "In cart" : "Add to Cart" }</span>
    </button>
  );
}
