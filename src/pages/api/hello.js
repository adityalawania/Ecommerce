// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     // Process a POST request
//   } else {
//     // Handle any other HTTP method
//   }

import { product } from "@/models/Product"


export default async function handler(req, res) {
  let products=await product.find()

    res.status(200).json({ name: 'adi' })
  }
