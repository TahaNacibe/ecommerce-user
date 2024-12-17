import mongooseConnect from "@/lib/mongoose"
import CategoriesItem from "@/components/categoriesPageComponents/category_item"
import { useState, useEffect } from "react"
import  Category  from "@/models/category"
import { useRouter } from "next/router"
import ProductItem from "@/components/product_item"
import ProductsService from "../services/products_service"

export default function CategoriesPage({ categoriesList }) {
  const router = useRouter();
  const productServices = new ProductsService()

  // State management variables
  const [selectedTags, setSelectedTags] = useState([]);
  const [displayList, setDisplayList] = useState(categoriesList);
  const [productsList, setProductsList] = useState([]);

  // Filter categories based on selected tags
  useEffect(() => {
    const filterCategories = () => {
      const filteredList = categoriesList.filter(cat => {
        return selectedTags.length === 0 || selectedTags.includes(cat.name);
      });
      setDisplayList(filteredList);
    };

    const getProductsList = async () => {
      if (selectedTags.length === 0) {
        const data = await productServices.getProductsByCategoriesFilter();
        setProductsList(data);
      }
    };

    filterCategories();
    getProductsList();
  }, [selectedTags, categoriesList]);

  // Toggle the category selected state
  const toggleTag = async (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);

    // Fetch products by selected categories
    const productsList = await productServices.getProductsByCategoriesFilter(
      updatedTags.map(selectedTag => categoriesList.find(cat => cat.name === selectedTag)._id)
    );
    setProductsList(productsList);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-white py-4 pt-20">
      {/* Categories section */}
      <div className="mx-auto px-8 md:w-1/4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Categories</h1>
        <div className="md:flex md:flex-wrap grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
          {displayList.map((cat, index) => (
            <CategoriesItem
              key={cat._id}
              cat={cat}
              selectedTags={selectedTags}
              toggleTag={() => toggleTag(cat.name)}
            />
          ))}
        </div>
      </div>

      {/* Products side */}
      <div className="w-full md:w-3/4">
        <div className="px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productsList.map((product, index) => (
              <ProductItem key={`${product._id}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const categories = await Category.find();
  return {
    props: {
      categoriesList: JSON.parse(JSON.stringify(categories))
    }
  };
}