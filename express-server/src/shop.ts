import express, { Request, Response } from 'express';
import { eq, sql } from 'drizzle-orm';
const router = express.Router();
import { OrderItem, order_items, orders, products } from './db/schema';
import { db } from "./config/db";


// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error('Error executing query:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({ error: 'An error occurred while executing the query.', details: err.message });
};

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/products', async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(products);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Categories]
 *     description: Retrieve a list of all unique product categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["electronics", "men's clothing", "women's clothing"]
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const rows = await db
      .selectDistinct({ category: products.product_category })
      .from(products)
      .orderBy(products.product_category);

    // Return array of category strings
    const categories = rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    handleQueryError(err, res);
  }
});

/**
 * @swagger
 * /categories/{category}/products:
 *   get:
 *     summary: Get products by category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *         example: electronics
 *     responses:
 *       200:
 *         description: List of products in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found in this category
 */
router.get('/categories/:category/products', async (req: Request, res: Response) => {
  try {
    const category = req.params.category as string;
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.product_category, category));

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No products found in this category.' });
    }

    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     description: Retrieve a list of all orders
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders);
    res.json(allOrders);
  } catch (err) {
    handleQueryError(err, res);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     description: Retrieve order details including order items with product information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details with items
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Order'
 *                 - type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Create a new order with multiple products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
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
