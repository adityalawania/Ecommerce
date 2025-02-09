import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log("Outside Razorpay API");

export default async function handler(req, res) {
    let am = req.body;
  
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    console.log("Inside Razorpay API");

    try {
        const order = await razorpay.orders.create({
            amount: am * 100, // Amount in paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });

        return res.status(200).json({ orderId: order.id });
    } catch (err) {
        console.error("Error creating order: ", err);
        return res.status(500).json({ error: "Error creating order" });
    }
}
