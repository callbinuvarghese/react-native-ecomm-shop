import { StyleSheet, FlatList, View, Text, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useCart } from '@/contexts/CartContext';
import { config } from '@/lib/config';
import { CartItem } from '@/lib/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * Get full image URL by prepending API base URL if needed
 */
function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // If path starts with /images/, prepend the API URL
  if (imagePath.startsWith('/images/')) {
    return `${config.apiUrl}${imagePath}`;
  }

  // Otherwise return as-is (already a full URL)
  return imagePath;
}

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  const imageUrl = getImageUrl(item.product_image);

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.product_name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id) },
      ]
    );
  };

  return (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.itemImage}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.itemCategory}>{item.product_category}</Text>
        <Text style={styles.itemPrice}>${item.product_price.toFixed(2)}</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <FontAwesome name="minus" size={14} color="#666" />
          </Pressable>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <FontAwesome name="plus" size={14} color="#666" />
          </Pressable>
        </View>

        <Pressable style={styles.removeButton} onPress={handleRemove}>
          <FontAwesome name="trash-o" size={18} color="#dc2626" />
        </Pressable>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { items, getTotal, getItemCount, clearCart } = useCart();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Proceed to checkout with ${itemCount} item(s) for $${total.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Checkout', onPress: () => {
          // TODO: Implement checkout flow
          Alert.alert('Success', 'Checkout functionality coming soon!');
        }},
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="shopping-cart" size={80} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add some products to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Pressable onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear All</Text>
        </Pressable>
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItemCard item={item} />}
        contentContainerStyle={styles.listContent}
      />

      {/* Footer with Total and Checkout */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <View>
            <Text style={styles.totalLabel}>Total ({itemCount} items)</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>

          <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
            <FontAwesome name="arrow-right" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  clearButton: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
