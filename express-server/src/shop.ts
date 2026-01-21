import express, { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
const router = express.Router();
import { OrderItem, order_items, orders, products } from './db/schema';
import { db } from "./config/db";


// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error('Error executing query:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({ error: 'An error occurred while executing the query.', details: err.message });
};

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(products);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get a single product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await db.select().from(products).where(eq(products.id, +id));
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get all orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders);
    res.json(allOrders);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get a single order by ID with its items
router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the order
    const orderRows = await db.select().from(orders).where(eq(orders.id, +id));
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Get order items with product details
    const items = await db
      .select({
        id: order_items.id,
        product_id: order_items.product_id,
        quantity: order_items.quantity,
        total: order_items.total,
        product_name: products.product_name,
        product_price: products.product_price,
        product_image: products.product_image,
      })
      .from(order_items)
      .leftJoin(products, eq(order_items.product_id, products.id))
      .where(eq(order_items.order_id, +id));

    res.json({ ...orderRows[0], items });
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Create a new order with multiple products and a user email
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { email, products: orderBody } = req.body;

    const order = await db.transaction(async (trx: any) => {
      const [newOrder] = await trx.insert(orders).values({ customer_email: email }).returning();
      const productPrices = await Promise.all(
        orderBody.map(async (orderItem: any) => {
          const [res] = await db.select().from(products).where(eq(products.id, +orderItem.product_id));
          return res.product_price;
        })
      );

      const orderProducts = await Promise.all(
        orderBody.map(async (orderItem: any, index: number) => {
          const total = (+productPrices[index] * +orderItem.quantity).toFixed(2);
          const [orderProduct] = await trx.insert(order_items).values({ order_id: newOrder.id, product_id: orderItem.product_id, quantity: orderItem.quantity, total: +total }).returning();
          return orderProduct;
        })
      );

      // Update the total price of the order
      const total = orderProducts.reduce((acc: number, curr: OrderItem) => {
        return acc + curr.total;
      }, 0);

      const [updatedOrder] = await trx
        .update(orders)
        .set({ total: total.toFixed(2) })
        .where(eq(orders.id, newOrder.id))
        .returning();
      return { ...updatedOrder, products: orderProducts };
    });
    res.json(order);
  } catch (err) {
    handleQueryError(err, res);
  }
});

export default router;
