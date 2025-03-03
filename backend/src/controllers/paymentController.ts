import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order';

// Ensure Stripe typings are available
type StripeType = typeof Stripe;

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cartItems, userId } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ message: 'No items in cart' });
      return;
    }

    // Format line items for Stripe
    const lineItems = cartItems.map((item: { title: string; imageUrl: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100), // Stripe requires amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: userId || 'guest',
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  // For local development, we'll simulate the webhook event
  // In production, you'd validate the webhook signature from Stripe
  let event: Stripe.Event;

  if (process.env.NODE_ENV === 'production') {
    const sig = req.headers['stripe-signature'] as string;
    
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
      }
      
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  } else {
    // For development, assume the request body is already the event
    // This allows us to test webhook functionality without Stripe signature validation
    try {
      event = req.body as Stripe.Event;
      console.log('Development mode: Skipping webhook signature verification');
    } catch (err: any) {
      console.error(`Webhook Error (Dev): ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Create order in database
      if (session.metadata?.userId && session.metadata.userId !== 'guest') {
        try {
          // Check if order already exists for this session
          const existingOrder = await Order.findOne({ 'paymentResult.id': session.id });
          
          if (existingOrder) {
            console.log('Order already exists for this session, skipping order creation:', existingOrder._id);
            break;
          }
          
          // Get line items from the session
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          
          // Create new order
          await Order.create({
            user: session.metadata.userId,
            orderItems: lineItems.data.map((item: Stripe.LineItem) => ({
              name: item.description || 'Product',
              quantity: item.quantity || 1,
              price: (item.amount_total || 0) / 100, // Convert from cents to dollars
              image: 'default-image.png', // Default image to satisfy validation 
              product: '650e9b47ac76b6b95de0201c', // Placeholder product ID to satisfy validation
            })),
            shippingAddress: {
              address: 'Default address', // These should be collected during checkout
              city: 'Default city',
              postalCode: '12345',
              country: 'US',
            },
            paymentMethod: 'Stripe',
            paymentResult: {
              id: session.id,
              status: session.payment_status,
              update_time: new Date().toISOString(),
              email_address: session.customer_details?.email || '',
            },
            taxPrice: (session.total_details?.amount_tax || 0) / 100,
            shippingPrice: 0,
            totalPrice: session.amount_total ? session.amount_total / 100 : 0,
            isPaid: true,
            paidAt: new Date(),
            isDelivered: false,
          });
        } catch (error) {
          console.error('Error creating order:', error);
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // If payment is successful and we're in development, simulate the webhook
    if (process.env.NODE_ENV !== 'production' && session.payment_status === 'paid') {
      try {
        console.log('Development mode: Simulating webhook for completed checkout');
        console.log('Session data:', session);
        
        // Check if order already exists for this session
        const existingOrder = await Order.findOne({ 'paymentResult.id': session.id });
        
        if (existingOrder) {
          console.log('Order already exists for this session, skipping order creation:', existingOrder._id);
          return;
        }
        
        // Simulate webhook by making a request to our own webhook endpoint
        const webhookData = {
          type: 'checkout.session.completed',
          data: {
            object: session
          }
        };
        
        // We're calling our own webhook endpoint - no need for separate HTTP request
        // Instead, we'll just process the same logic directly
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        console.log('Line items retrieved:', lineItems.data);
        
        if (session.metadata?.userId && session.metadata.userId !== 'guest') {
          console.log('Creating order for user:', session.metadata.userId);
          
          const newOrder = await Order.create({
            user: session.metadata.userId,
            orderItems: lineItems.data.map((item: Stripe.LineItem) => ({
              name: item.description || 'Product',
              quantity: item.quantity || 1,
              price: (item.amount_total || 0) / 100,
              image: 'default-image.png', // Provide a default image to satisfy validation
              product: '650e9b47ac76b6b95de0201c', // Use a placeholder product ID
            })),
            shippingAddress: {
              address: 'Default address',
              city: 'Default city',
              postalCode: '12345',
              country: 'US',
            },
            paymentMethod: 'Stripe',
            paymentResult: {
              id: session.id,
              status: session.payment_status,
              update_time: new Date().toISOString(),
              email_address: session.customer_details?.email || '',
            },
            taxPrice: (session.total_details?.amount_tax || 0) / 100,
            shippingPrice: 0,
            totalPrice: session.amount_total ? session.amount_total / 100 : 0,
            isPaid: true,
            paidAt: new Date(),
            isDelivered: false,
            status: 'pending',
          });
          
          console.log('Development mode: Order created for checkout session', newOrder);
        } else {
          console.log('No valid user ID in metadata:', session.metadata);
        }
      } catch (webhookErr) {
        console.error('Error simulating webhook:', webhookErr);
      }
    }
    
    res.status(200).json({
      success: session.payment_status === 'paid',
      session,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Development route to manually trigger a webhook (only available in development)
export const triggerWebhookTest = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ message: 'This endpoint is only available in development mode' });
    return;
  }
  
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      res.status(400).json({ message: 'Session ID is required' });
      return;
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Create a mock webhook event
    const event = {
      type: 'checkout.session.completed',
      data: {
        object: session
      }
    };
    
    // Process the same logic as in the webhook handler
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    
    if (session.metadata?.userId && session.metadata.userId !== 'guest') {
      // Check if order already exists for this session
      const existingOrder = await Order.findOne({ 'paymentResult.id': session.id });
      
      if (existingOrder) {
        console.log('Order already exists for this session, skipping order creation:', existingOrder._id);
        res.status(200).json({ 
          success: true, 
          message: 'Order already exists for this session',
          order: existingOrder
        });
        return;
      }
      
      const newOrder = await Order.create({
        user: session.metadata.userId,
        orderItems: lineItems.data.map((item: Stripe.LineItem) => ({
          name: item.description || 'Product',
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100,
          image: 'default-image.png', // Default image to satisfy validation
          product: '650e9b47ac76b6b95de0201c', // Placeholder product ID to satisfy validation 
        })),
        shippingAddress: {
          address: 'Default address',
          city: 'Default city',
          postalCode: '12345',
          country: 'US',
        },
        paymentMethod: 'Stripe',
        paymentResult: {
          id: session.id,
          status: session.payment_status,
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email || '',
        },
        taxPrice: (session.total_details?.amount_tax || 0) / 100,
        shippingPrice: 0,
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        status: 'pending',
      });
      
      console.log('Test webhook: Order created', newOrder);
      
      res.status(200).json({ 
        success: true, 
        message: 'Test webhook processed successfully and order created' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Session does not have valid user ID in metadata' 
      });
    }
  } catch (error) {
    console.error('Error triggering test webhook:', error);
    res.status(500).json({ message: 'Server error' });
  }
};