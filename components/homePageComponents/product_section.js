import React from 'react';
import ProductItem from "../product_item";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeProductsSection({ title = "Featured Products", products }) {
  return (
    <section className="py-8">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-black rounded-full" />
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        
        <Link
          href={"/products"}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
          <span className="text-sm font-medium">View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products grid*/}
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <ProductItem 
              key={`${product._id}-${index}`} 
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}