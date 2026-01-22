# Implementation Guide

This document provides the remaining code to complete the Shop App.

## Status

✅ Project created with Expo SDK 54
✅ Dependencies installed
✅ API layer complete (`lib/api.ts`)
✅ Type definitions complete (`lib/types.ts`)
✅ Cart store complete (`lib/store.ts`)
✅ React Query hooks complete (`hooks/`)
✅ QueryClient provider added to root layout
✅ ProductCard component created

## Remaining Tasks

### 1. Products List Screen

Update `app/(tabs)/index.tsx`:

```typescript
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsScreen() {
  const { data: products, isLoading, error, refetch } = useProducts();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error loading products</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### 2. Product Details Screen

Create `app/product/[id].tsx`:

```typescript
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/lib/store';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const productId = parseInt(id as string);
  const { data: product, isLoading } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading || !product) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: product.product_name }} />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: product.product_image }}
          style={styles.image}
          contentFit="contain"
        />
        <View style={styles.content}>
          <Text style={styles.name}>{product.product_name}</Text>
          <Text style={styles.category}>{product.product_category}</Text>
          <Text style={styles.price}>${product.product_price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.product_description}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={styles.button}
          onPress={() => addItem(product)}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  category: { fontSize: 14, color: '#666', marginBottom: 16, textTransform: 'capitalize' },
  price: { fontSize: 28, fontWeight: 'bold', color: '#2563eb', marginBottom: 20 },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#e5e5e5', backgroundColor: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
```

### 3. Shopping Cart Screen

Update `app/(tabs)/cart.tsx`:

```typescript
import { View, Text, FlatList, Pressable, TextInput, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import { useCartStore } from '@/lib/store';
import { useCreateOrder } from '@/hooks/useOrders';

export default function CartScreen() {
  const [email, setEmail] = useState('');
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const createOrder = useCreateOrder();

  const handleCheckout = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    try {
      await createOrder.mutateAsync({
        email,
        products: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      Alert.alert('Success', 'Order placed successfully!');
      clearCart();
      setEmail('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create order');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.product_image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={2}>{item.product_name}</Text>
              <Text style={styles.price}>${item.product_price.toFixed(2)}</Text>
              <View style={styles.controls}>
                <Pressable
                  style={styles.controlButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.controlText}>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable
                  style={styles.controlButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.controlText}>+</Text>
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Pressable
          style={styles.checkoutButton}
          onPress={handleCheckout}
          disabled={createOrder.isPending}
        >
          <Text style={styles.checkoutText}>
            {createOrder.isPending ? 'Processing...' : 'Checkout'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666' },
  item: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderColor: '#e5e5e5' },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#2563eb', marginVertical: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  controlButton: { backgroundColor: '#e5e5e5', width: 32, height: 32, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  controlText: { fontSize: 18, fontWeight: 'bold' },
  quantity: { fontSize: 16, marginHorizontal: 12 },
  removeButton: { marginLeft: 'auto' },
  removeText: { color: 'red' },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#e5e5e5' },
  total: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e5e5', padding: 12, borderRadius: 8, marginBottom: 12 },
  checkoutButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
```

### 4. Update Tab Layout

Update `app/(tabs)/_layout.tsx` to add cart badge:

```typescript
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useCartStore } from '@/lib/store';

export default function TabLayout() {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### 5. Add .gitignore

Create `.gitignore`:

```
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
```

## Testing

1. Start backend: `cd ../express-server && npm run dev`
2. Start app: `npm start`
3. Test on device or simulator
4. Try adding products to cart
5. Test checkout flow

## Deployment

See Expo documentation for publishing to app stores.
