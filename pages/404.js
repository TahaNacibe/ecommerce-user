"use client";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFoundPage() {
  return (
    <div className=" bg-white flex items-center justify-center pt-20">
      <div className="h-full w-full bg-white rounded-2xl p-8 md:p-12">
        <div className="items-center overflow-y-hidden">

          {/* Illustration Section */}
          <div className="md:order-2 order-1">
            <Image
              width={300}
              height={300}
              src="/404_error.svg"
              alt="404 Error Illustration"
              className="w-full max-w-md mx-auto md:h-auto h-40"
            />
          </div>
          {/* Content Section */}
          <div className="p-8 md:order-1 order-2 absolute bottom-0">
            <div className="space-y-2">
              <h1 className="md:text-4xl font-bold text-gray-900">
                404 - Page Not Found
              </h1>
              <p className="md:text-xl text-gray-600">
                Oops! We couldn&apos;t find what you&apos;re looking for.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
