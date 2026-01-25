import { useState } from 'react';
import { StyleSheet, FlatList, View, Text, Pressable, Alert, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useCartStore } from '@/lib/store';
import { useCreateOrder } from '@/hooks/useOrders';
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
  const { updateQuantity, removeItem } = useCartStore();
  const imageUrl = getImageUrl(item.product_image);

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.product_name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
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
  const { items, total, itemCount, clearCart } = useCartStore();
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const createOrderMutation = useCreateOrder();

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckout = () => {
    setEmail('');
    setEmailError('');
    setCheckoutModalVisible(true);
  };

  const handleSubmitOrder = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');

    try {
      // Prepare order data
      const orderData = {
        email: email.trim(),
        products: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      // Submit order
      await createOrderMutation.mutateAsync(orderData);

      // Close modal
      setCheckoutModalVisible(false);

      // Show success message
      Alert.alert(
        'Order Placed Successfully!',
        `Your order has been placed. A confirmation email will be sent to ${email}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear cart after success
              clearCart();
              setEmail('');
            },
          },
        ]
      );
    } catch (error) {
      // Show error message
      Alert.alert(
        'Order Failed',
        error instanceof Error ? error.message : 'Failed to place order. Please try again.',
        [{ text: 'OK' }]
      );
    }
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

      {/* Checkout Modal */}
      <Modal
        visible={checkoutModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCheckoutModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Checkout</Text>
              <Pressable onPress={() => setCheckoutModalVisible(false)}>
                <FontAwesome name="times" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items:</Text>
                <Text style={styles.summaryValue}>{itemCount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total:</Text>
                <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.emailInput, emailError ? styles.emailInputError : null]}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setCheckoutModalVisible(false)}
                  disabled={createOrderMutation.isPending}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.submitButton,
                    createOrderMutation.isPending && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitOrder}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Place Order</Text>
                      <FontAwesome name="check" size={16} color="#fff" />
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  emailInputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
