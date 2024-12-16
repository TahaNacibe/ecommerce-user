import React, { useContext, useEffect, useState } from 'react';
import mongooseConnect from '@/lib/mongoose';
import { Box,ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/models/product';
import { CartContext } from '@/components/cart/CartContext';
import Category from '@/models/category';

function ProductInfoPage({ product, categories }) {
    const [isImageView, setImageView] = useState(0);
    const [isViewOpen, setIsViewOpen] = useState(false);
    
    useEffect(() => {
        if (isViewOpen) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = ''; // Enable scroll
        }
        return () => {
            document.body.style.overflow = ''; // Cleanup when the component unmounts
        };
    }, [isViewOpen]);

    const handleImageSwitch = (otherImages, forward) => {
        if (!Array.isArray(otherImages) || otherImages.length === 0) {
            console.error("otherImages is not a valid array or is empty");
            return;
        }

        setImageView((prev) => {
            const currentIndex = Math.max(0, Math.min(prev, otherImages.length - 1));

            if (forward) {
                return (currentIndex + 1) % otherImages.length;
            } else {
                return (currentIndex - 1 + otherImages.length) % otherImages.length;
            }
        });
    };

    const ImageBigView = ({ otherImages, closeView }) => {
        return (
            <div className='bg-black bg-opacity-40 w-screen h-screen z-50 absolute overflow-hidden items-center flex justify-between justify-items-center scroll-m-0'>
                <div
                    onClick={() => { handleImageSwitch(otherImages, false); }}
                    className='bg-white/20 rounded-md m-4 py-8 px-4 cursor-pointer'>
                    <ChevronLeft />
                </div>
                <img src={otherImages[isImageView]} className='h-screen p-4' alt='' />
                <div
                    onClick={() => { handleImageSwitch(otherImages, true); }}
                    className='bg-white/20 rounded-md m-4 py-8 px-4 cursor-pointer'>
                    <ChevronRight />
                </div>
                <button
                    onClick={closeView}
                    className='absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-3'>
                    X
                </button>
            </div>
        );
    };

    const closeImageView = () => {
        setIsViewOpen(false);
    };

    const openImageView = (imageIndex) => {
        setImageView(imageIndex)
        setIsViewOpen(true);
    };

    if (!product) return <div>Product not found</div>;

    const otherImages = product.other_images || [];

    return (
        <>
            {isViewOpen && <ImageBigView otherImages={otherImages} closeView={closeImageView} />}
            <div className="pt-20 md:grid md:grid-cols-2 gap-8 bg-white md:pt-20 p-2">
                {/* Image Section */}
                <ImageWidget product={product} otherImages={otherImages} openImageView={(selectedIndex) => openImageView(selectedIndex)} />

                {/* Details Section */}
                <div className='pt-4 '>
                    <h2 className="text-2xl font-medium mb-4 border mr-4 rounded-lg px-3 py-2 flex items-center text-center gap-3">
                        <Box />
                        {product.title}
                    </h2>

                    {/* Description section */}
                    <DescriptionWidget product={product} />

                    {/* Price widget */}
                    <PriceDisplayWidget product={product} />
                    <QuantityWidget product={product} />

                    {/* Buttons */}
                    <ButtonsForAction productId={product._id.toString()} />

                    <h1 className='my-4 px-2 '>More details:</h1>
                    <MoreDetailsWidget product={product} categories={categories} />
                </div>
            </div>
        </>
    );
}




const ImageWidget = ({ product, otherImages, openImageView }) => {
    return (
        <div className="p-4 bg-white rounded-lg">
            {/* Main Image Section */}
            <div className="relative mb-4">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-auto w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                />
                <h1 className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-semibold">
                    Main Image
                </h1>
            </div>

            {/* Other Images Section */}
            <h1 className="px-2 font-semibold text-lg text-gray-800 mt-4">
                Other Images:
            </h1>
            {otherImages.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                    {otherImages.map((url, i) => (
                        <div
                            key={i}
                            className="relative group overflow-hidden rounded-lg border border-gray-200 hover:shadow-md"
                            onClick={() => openImageView(i)} // Open on image click
                        >
                            <img
                                src={url}
                                alt={`Image ${i}`}
                                className="h-full w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                #{i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 px-2 mt-3">No additional images available.</p>
            )}
        </div>
    );
};


const DescriptionWidget = ({ product }) =>{
    return (
        <div className='border px-3 mr-4 rounded-lg py2'>
                  
        <h3 className='text-2xl pb-2'>
                  Description
        </h3>
        <p className="text-gray-500 mb-4">{product.description}</p>
              </div>
    )
}


const PriceDisplayWidget = ({product}) => {
    return (
        <div className="my-4 rounded-lg p-4 border gap-4 mr-4">
        <span className="font-medium">Price:  </span>
        {product.isInDiscount ? (
          <>
            <span className="font-medium rounded-full bg-blue-100 px-2 py-2">{product.discountPrice.toFixed(2)} USD</span>
            <span className="ml-4 text-gray-500 line-through font-medium rounded-full bg-gray-100 px-2 py-2">{product.price.toFixed(2)} USD</span>
          </>
        ) : (
          <span className="font-medium rounded-full bg-blue-100 px-2 py-2">{product.price.toFixed(2)} USD</span>
        )}
      </div>
    )
}

const QuantityWidget = ({ product }) => {
    return (
        <div className="mb-4 rounded-lg border p-4 mr-4">
          <span className="font-medium">Quantity:</span> <span className={`px-2 py-2 rounded-lg ${product.quantity === 0? "text-orange-600 bg-orange-100" : "text-blue-600 bg-blue-100"}`}>{product.quantity === 0? "Sold out" : product.quantity}</span>
        </div>
    )
}


const MoreDetailsWidget = ({ product, categories }) => {
    const tags = product.tags || [];
    return (
        <div className='pl-2'>
            {/* sold count and type*/}
            <div className='flex gap-4'>
        <div className="mb-4 rounded-lg px-3 py-2 w-fit bg-gray-100">
          <span className="font-medium">Sold:</span> {product.sold}
            </div>
            <div className="mb-4 rounded-lg px-3 py-2 w-fit bg-gray-100">
          <span className="font-medium">Product Type:</span> {product.productType}
            </div>
            </div>
             {/* tags builder */}
             {tags.length > 0 && (
          <div className="mb-4 rounded-lg border px-4 py-3 ">
                    <span className="font-medium ">Tags:</span>
                    <div className='flex gap-2 pt-2'>
                    {tags.map((tag, index) => (
                        <div key={index.toString()} className='rounded-lg px-4 py-2 bg-black text-white'>
                            <h3>{tag}</h3>
                </div>
            ))}
                   </div>
          </div>
        )}
            {/* categories builder */}
            {categories.length > 0 && (
          <div className="mb-4 rounded-lg border px-4 py-3 ">
                    <span className="font-medium ">Categories:</span>
                    <div className='flex gap-2 pt-2'>
                    {categories.map((cat, index) => (
                        <div key={index.toString()} className='rounded-lg px-4 py-2 bg-black text-white'>
                            <h3>{cat.name}</h3>
                </div>
            ))}
                   </div>
          </div>
        )}
        </div>
    )
}

const ButtonsForAction = ({ productId }) => {
    //* vars
    const { isProductInTheCart, changeProductStateInCart, getItemCountInTheCart } = useContext(CartContext)
    const productState = isProductInTheCart(productId)

    //* ui tree
    return (
        <div className='flex gap-4 py-4 pb-8'>
            {/* add To cart */}
            <div
                onClick={() => changeProductStateInCart(productId)}
                className='flex gap-2 rounded-lg px-4 py-3 bg-black text-white cursor-pointer'>
                <ShoppingCart />
                {productState? `In the cart (${getItemCountInTheCart(productId)})` : "Add to cart"}
            </div>
           
        </div>
    )
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;

    try {
        // have no idea why is that working but don't remove it otherwise it stop
        Category.call(null)
      const product = await Product.findById(id).populate("categories").lean();
      if (!product) return { notFound: true };
      return {
          props: {
            categories: JSON.parse(JSON.stringify(product.categories)),
              product: JSON.parse(JSON.stringify(product))
          }
      };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { props: { product: null } };
  }
}

export default ProductInfoPage;