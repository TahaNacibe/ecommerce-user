const { Schema, models, model } = require("mongoose");


const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    country: String,
    city: String,
    address: String,
    phoneNumber: String,
    postalCode: String,
    senderEmail:String,
    isPaid: Boolean
},{timestamps:true})

const Order = models.Order || model("Order", OrderSchema)

export {Order}