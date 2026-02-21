import { SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox'
    ? SquareEnvironment.Sandbox
    : SquareEnvironment.Production,
});

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { holdId, quantity, amount } = JSON.parse(event.body);

    if (!holdId || !quantity || quantity < 1 || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request: holdId, quantity and amount required' }),
      };
    }

    console.log('Creating Square payment link:', { holdId, quantity, amount });

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      quickPay: {
        name: `Fundraiser Number${quantity > 1 ? 's' : ''} (${quantity})`,
        priceMoney: {
          amount: BigInt(amount), // amount in cents
          currency: 'AUD',
        },
        locationId: process.env.SQUARE_LOCATION_ID,
      },
      checkoutOptions: {
        redirectUrl: `${process.env.SITE_URL}/success.html`,
      },
      paymentNote: holdId, // stored on Payment.note for webhook correlation
    });

    const paymentLink = response.data?.paymentLink ?? response.paymentLink;

    if (!paymentLink?.url) {
      console.error('No payment link URL in response:', JSON.stringify(response, null, 2));
      throw new Error('No payment link URL returned from Square');
    }

    console.log('✅ Square payment link created:', paymentLink.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: paymentLink.url }),
    };
  } catch (error) {
    console.error('Error creating Square payment link:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create payment link', details: error.message }),
    };
  }
}
