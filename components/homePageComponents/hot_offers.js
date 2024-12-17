import { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Tag, Flame, ShoppingCart, Trash2Icon } from "lucide-react";
import CostumeButton from "../costume_button";
import { CartContext } from "../cart/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function AutoCarousel({ products }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalTime = 10000; // 10 seconds

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === products.length - 1 ? 0 : prevIndex + 1
            );
        }, intervalTime);

        return () => clearInterval(interval);
    }, [products.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="relative w-full h-auto min-h-[400px] lg:h-2/3 overflow-hidden">
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {products.map((product, index) => (
                    <div
                        className="w-full flex-shrink-0 relative pt-16 md:pt-24 py-4 md:py-8 px-2 md:px-4"
                        key={`${product._id}-${index}`}
                    >
                        {/* Advanced background blending */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${product.image})`,
                                filter: 'blur(20px) brightness(50%)',
                                transform: 'scale(1.1)',
                                backgroundBlendMode: 'multiply',
                                backgroundColor: 'rgba(0,0,0,0.7)'
                            }}
                        />
    
                        {/* Gradient overlay for additional depth */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
    
                        {/* Content container */}
                        <div className="relative h-full flex flex-col lg:flex-row items-center px-4 md:px-8 lg:px-16 gap-8">
                            <DetailsSection product={product} />
                            
                            {/* Image container */}
                            <div className="w-full lg:w-1/3 h-full relative order-first lg:order-last pb-4">
                                <div className="w-full max-w-[300px] mx-auto lg:max-w-none">
                                    <img
                                       
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-auto object-contain rounded-lg shadow-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    
            {/* Navigation buttons */}
            <CarouselButton isRight={false} onClickAction={goToPrevious} />
            <CarouselButton isRight={true} onClickAction={goToNext} />
        </div>
    );
}

function CarouselButton({ isRight, onClickAction }) {
    return (
        <button
            className={`absolute top-1/2 -translate-y-1/2 text-white p-2 md:p-3 
                bg-white/10 backdrop-blur-sm rounded-full z-50 
                hover:bg-white/20 transition-all duration-300 
                ${isRight ? "right-2 md:right-6" : "left-2 md:left-6"}`}
            onClick={onClickAction}
        >
            {isRight ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
    );
}

function DetailsSection({ product }) {
    return (
        <div className="flex-1 flex flex-col h-full text-white w-full lg:w-2/3 px-2 md:px-4 lg:px-8">
            <div className="flex-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 md:mb-6">
                    {product.title}
                </h1>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 line-clamp-3 md:line-clamp-6">
                    {product.description}  
                </p>

                {/* price offer */}
                <div className="flex flex-wrap gap-2 md:gap-4">
                    {/* old price */}
                    <TagElement bgColor="bg-blue-900">
                        <Tag size={16} className="" />
                        <h2 className={`text-lg md:text-xl ${product.isInDiscount? "line-through" : ""} text-white`}>
                            ${product.price}
                        </h2>
                    </TagElement>

                    {/* new price */}
                    {product.isInDiscount && (
                        <TagElement bgColor="bg-orange-800">
                            <Flame size={16} className="" />
                            <h1 className="text-lg md:text-xl text-white">
                                ${product.discountPrice}
                            </h1>
                        </TagElement>
                    )}
                </div>
            </div>

            {/* Button container */}
            <div className="mt-4 md:mt-auto pb-2 pt-2 md:pt-4">
                <ButtonWarper productId={product._id} />
            </div>
        </div>
    );
}

function TagElement({ children, bgColor }) {
    return (
        <div className={`rounded-full flex gap-2 md:gap-4 items-center py-1 md:py-2 px-3 md:px-4 w-fit ${bgColor}`}>
            {children}
        </div>
    );
}

function ButtonWarper(productId) {
    const { isProductInTheCart, changeProductStateInCart } = useContext(CartContext);
    const isInCart = isProductInTheCart(productId);
    
    
    return (
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 p-1">
            <Link href={`product/${productId.productId}`} className="w-full sm:w-auto">
                <CostumeButton 
                    bgColor="bg-transparent" 
                    text="Read more" 
                    onClickAction={() => {}} 
                />
            </Link>
            <CostumeButton 
                bgColor={isInCart ? "bg-gray-700" : "bg-indigo-800"}
                text={isInCart ? "Remove from cart" : "Add To cart"}
                onClickAction={() => changeProductStateInCart(productId,!isInCart)}
                icon={isInCart ? <Trash2Icon size={16} className="" /> : <ShoppingCart size={16} className="" />}
                className="w-full sm:w-auto"
            />
        </div>
    );
}