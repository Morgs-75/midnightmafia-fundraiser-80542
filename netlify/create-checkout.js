import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  const { holdId, quantity, amount } = JSON.parse(event.body);

  // Calculate subtotal and fee
  // If amount provided (includes fee), calculate backwards; otherwise use default
  const totalAmount = amount || (quantity * 2500);

  // Calculate the subtotal (amount before fee)
  // Fee formula: fee = subtotal * 0.0175 + 0.30
  // Total = subtotal + fee
  // Total = subtotal + (subtotal * 0.0175 + 0.30)
  // Total = subtotal * 1.0175 + 0.30
  // subtotal = (Total - 0.30) / 1.0175
  const subtotalAmount = Math.round((totalAmount - 30) / 1.0175);
  const feeAmount = totalAmount - subtotalAmount;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'link'],
    payment_method_options: {
      card: {
        request_three_d_secure: 'automatic',
      },
    },
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: `Fundraiser Number${quantity > 1 ? 's' : ''} (${quantity})`,
            description: `${quantity} lucky number${quantity > 1 ? 's' : ''} for the draw`,
          },
          unit_amount: subtotalAmount,
        },
        quantity: 1
      },
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Payment Processing Fee',
            description: 'Covers credit card processing costs',
          },
          unit_amount: feeAmount,
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.SITE_URL}/success.html`,
    cancel_url: `${process.env.SITE_URL}`,
    metadata: { holdId }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url })
  };
}
