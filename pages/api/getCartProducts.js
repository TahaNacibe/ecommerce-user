const { Product } = require("@/models/product");
const { default: mongoose } = require("mongoose");


const handler = async (req, res) => {
    try {
        // Connect to MongoDB only once
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
        }

        //* get the ids list
        let { productsIds } = req.query
        // Check if productsIds is a string and split it into an array
        productsIds = productsIds.split(",");
        console.log(productsIds)
        //* get the data
        const response = await Product.find({ _id: productsIds }, null, { sort: { "updatedAt": 1 } })
        console.log("the servers say",response)
        res.status(200).json(response)
    } catch (error) {
        //* in error case
        res.status(500).json({error: "nothing was found"})
    }
} 

export default handler