import { Router } from 'express';
import ejs from 'ejs';
import path from 'path';
import {  client } from '../config/api';

const router = Router();

router.post('/order', async (req, res) => {
  const {
    orderNumber,
    orderDate,
    customerName,
    customerPhone,
    deliveryAddress,
    mapLink,
    items,
    subtotal,
    deliveryFee,
    finalAmount,
    paymentMethod
  } = req.body;

  const templatePath = path.join(__dirname, '../templates/messageProduct.ejs');

  const itens= items.map((item: any)=>{
    return `
        ${item.quantity} x ${item.itemName}
        💵 ${item.quantity} x R$ ${item.price} = R$ ${item.quantity * item.price}
    `
  })

  try {
    const message = await ejs.renderFile(templatePath, {
      orderNumber,
      orderDate,
      customerName,
      customerPhone,
      deliveryAddress,
      mapLink,
      itensFormatados: itens.join(''),
      subtotal,
      deliveryFee,
      finalAmount,
      paymentMethod
    });

    console.log(message)

    const messageResponse = await client.messages
    .create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5511963793740'
    })
  

    res.status(200).json({ message: messageResponse  });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to send message', error });
  }
});

export default router;
