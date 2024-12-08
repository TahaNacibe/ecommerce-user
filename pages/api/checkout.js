import mongooseConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/product";
import UserProfile from "@/models/UserProfile";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.json("that should've been a post request my nigga")
        return;
    }

    //* get the passed data
    const { name, email, address, phoneNumber, city, postalCode, country, cartProducts, senderEmail } = req.body
    console.log("the user email ",senderEmail)
    await mongooseConnect()

    //* get data
    const productsList = cartProducts
    const uniqIds = [...new Set(productsList)]
    //? get the info for each item in the list ignoring the duplicated uid
    const productsInfo = await Product.find({ _id: uniqIds })
    
    //* structure data
    let line_items = []
    for (const productId of uniqIds) {
        console.log("get the item and start working")
        //? get the item info
        const productInfo = productsInfo.find(product => product._id.toString() === productId)
        //? get the item count
        const quantity = productsList.filter(p => p === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
            console.log("put the item")
            line_items.push({
                quantity,
                price_data: {
                    currency: "USD",
                    product_data: { name: productInfo.title },
                    unit_amount: (productInfo.isInDiscount? productInfo.discountPrice : productInfo.price) *100
                }
            })
        } 

    }
    //* create the order object
    const orderDoc = await Order.create({
        line_items,name,email,address,city,country,phoneNumber,postalCode,senderEmail,isPaid:false
    })

    //* stripe check out (to be honest i don't get shit after that point the docs look like gebrish and i no mage)
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: "http://localhost:3000/cart?success=1",
        cancel_url: "http://localhost:3000/cart?canceled=1",
        metadata:{orderId:orderDoc._id.toString()}
    })

    //* add order to user orders list
    const userOrder = await UserProfile.findOneAndUpdate({email: senderEmail}, {
        $push: {
          orders: orderDoc._id.toString(), // Add `newOrderItem` to the orders array
        }
    }, { new: true })

    res.json({
        url:session.url
    })
}