import { Order } from '@/models/Order';
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing to handle raw bodies
  },
};

const handler = async (req = NextApiRequest, res = NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const buf = await buffer(req); // Read the raw body as a buffer
    const event = JSON.parse(buf.toString()); // Parse the JSON

    console.log("the before switch ------------------------------->")
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = session.metadata.orderId
        const payed = session.payment_status === "paid"
        if (payed) {
          await Order.findByIdAndUpdate(orderId, {
            isPaid:true
          })
        }
        console.log("Checkout session completed:", session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    

    // Respond to Stripe to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export default handler;
