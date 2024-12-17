import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/product";
import HotOffersDisplay from "@/components/homePageComponents/hot_offers";
import HomeProductsSection from "@/components/homePageComponents/product_section";




export default function Home({ products, lastProductsList }) {
  return (
    <section className="overflow-x-hidden" id="HomePage">
      {/* important item show */}
      <HotOffersDisplay products={products} />
      {/* display the items grid  */}
      <HomeProductsSection products={lastProductsList} />
    </section>
  );
}


export async function getServerSideProps() {
  await mongooseConnect()
  {/* get the last 10 offers and order them  */}
  const products = await Product.find({ isInDiscount: true }, null, { limit: 10, sort: { "updatedAt": 1 } })
  {/* you can use user favorite products list to filter and get the items that meet the categories, but i will keep it simple here, please my future self don't add it */}
  const lastProductsList = await Product.find({}, null, {limit: 30, sort: { "updatedAt": 1 } })
  {/* return special offers if found */}
  if (products && products.length > 0) {
    return {
      props: {
        lastProductsList: JSON.parse(JSON.stringify(lastProductsList)),
        products: JSON.parse(JSON.stringify(products))
      }
    }
  {/* else return the last 10, later can make it return the high reviews ones */}
  } else {
    const products = await Product.find({}, null, { sort: { "updatedAt": -1 }, limit: 5 })
    return {
      props: {
        lastProductsList: JSON.parse(JSON.stringify(lastProductsList)),
        products: JSON.parse(JSON.stringify(products))
      }
    }
  }
}