import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag, Flame, ShoppingCart } from "lucide-react";
import CostumeButton from "../costume_button";

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
        <div className="relative w-full h-2/3 overflow-hidden">
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {products.map((product, index) => (
                    <div
                        className="w-full flex-shrink-0 relative pt-24 py-8 px-4"
                        key={`${product._id}-${index}`}
                    >
                        {/* Background image with blur */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center "
                            style={{
                                backgroundImage: `url(${product.image})`,
                                filter: 'blur(20px)',
                                transform: 'scale(1.1)',
                                opacity: '0.4'
                            }}
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/75" />

                        {/* Content container */}
                        <div className="relative h-full flex items-center px-16">
                        <DetailsSection product={product} />
                      {/* image container */}
                            <div className="w-1/3 h-full relative pr-8 pb-2">
                                <div className="absolute w-full">
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        className="w-full object-contain"
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
            className={`absolute top-1/2 -translate-y-1/2 text-white p-3 
                bg-white/10 backdrop-blur-sm rounded-full z-50 
                hover:bg-white/20 transition-all duration-300 
                ${isRight ? "right-6" : "left-6"}`}
            onClick={onClickAction}
        >
            {isRight ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
    );
}

function DetailsSection({ product }) {
  return (
      <div className="flex-1 flex flex-col h-full text-white pr-8">
          {/* Content wrapper with flex-1 to push buttons to bottom */}
          <div className="flex-1">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                  {product.title}
              </h1>
              <p className="text-base text-gray-300 mb-6">
                  {product.description}
              </p>

              {/* price offer */}
              <div className="flex gap-4">
                  {/* old price */}
                  <TagElement bgColor="bg-blue-900">
                      <Tag size={20} />
                      <h2 className="text-xl line-through text-white">
                          ${product.price}
                      </h2>
                  </TagElement>

                  {/* new price */}
                  {product.isInDiscount? <TagElement bgColor="bg-orange-800">
                      <Flame size={20} />
                      <h1 className="text-xl text-white">
                          ${product.discountPrice}
                      </h1>
                  </TagElement> : null}
              </div>
          </div>

          {/* Button container fixed at bottom */}
          <div className="mt-auto pb-2 pt-4">
              <ButtonWarper />
          </div>
      </div>
  );
}

function TagElement({ children, bgColor }) {
  return (
    <div className={`rounded-full flex gap-4 items-center py-2 px-4 w-fit ${bgColor}`}>
      {children}
    </div>
  )
}

function ButtonWarper() {
  return (
    <div className="flex gap-4 p-1">
      <CostumeButton bgColor={"bg-transparent"} text={"Read more"} onClickAction={() => {}} />
      <CostumeButton bgColor={"bg-indigo-800"} text={"Add To cart"} onClickAction={() => {}} icon={<ShoppingCart size={20} />} />
    </div>
  )
}