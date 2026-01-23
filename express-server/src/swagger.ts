import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Shop API',
      version: '1.0.0',
      description: 'REST API for e-commerce shop with products, categories, and orders',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://192.168.1.18:3000',
        description: 'Local network server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID',
              example: 1,
            },
            product_name: {
              type: 'string',
              description: 'Product name',
              example: 'Samsung Galaxy Tab',
            },
            product_category: {
              type: 'string',
              description: 'Product category',
              example: 'electronics',
            },
            product_description: {
              type: 'string',
              description: 'Product description',
              example: '8-inch display, 16GB storage',
            },
            product_price: {
              type: 'number',
              format: 'float',
              description: 'Product price',
              example: 149.99,
            },
            product_stock: {
              type: 'integer',
              description: 'Stock quantity',
              example: 10,
            },
            product_image: {
              type: 'string',
              description: 'Product image URL or path',
              example: '/images/tablet.jpg',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Order ID',
              example: 1,
            },
            customer_email: {
              type: 'string',
              format: 'email',
              description: 'Customer email',
              example: 'customer@example.com',
            },
            total: {
              type: 'number',
              format: 'float',
              description: 'Order total',
              example: 299.98,
            },
            order_date: {
              type: 'string',
              format: 'date-time',
              description: 'Order date',
            },
          },
        },
        CreateOrder: {
          type: 'object',
          required: ['email', 'products'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer email',
              example: 'customer@example.com',
            },
            products: {
              type: 'array',
              description: 'Array of products to order',
              items: {
                type: 'object',
                required: ['product_id', 'quantity'],
                properties: {
                  product_id: {
                    type: 'integer',
                    description: 'Product ID',
                    example: 1,
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantity',
                    example: 2,
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/shop.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
