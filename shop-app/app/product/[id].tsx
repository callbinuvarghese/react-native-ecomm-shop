import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/lib/store';
import { config } from '@/lib/config';

function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('/images/')) {
    return `${config.apiUrl}${imagePath}`;
  }
  return imagePath;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { addItem, isInCart, getItemQuantity } = useCartStore();
  const productId = parseInt(id || '0', 10);

  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorTitle}>Error Loading Product</Text>
        <Text style={[styles.errorMessage, { color: theme.colors.text }]}>{error.message}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={styles.errorTitle}>Product Not Found</Text>
      </View>
    );
  }

  const imageUrl = getImageUrl(product.product_image);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: product.product_name,
          headerBackTitle: 'Back'
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={[styles.imageContainer, { borderBottomColor: theme.colors.border }]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.product_category}</Text>
          </View>

          {/* Product Name */}
          <Text style={[styles.productName, { color: theme.colors.text }]}>{product.product_name}</Text>

          {/* Price */}
          <Text style={styles.price}>${product.product_price.toFixed(2)}</Text>

          {/* Description */}
          {product.product_description && (
            <View style={[styles.descriptionContainer, { borderTopColor: theme.colors.border }]}>
              <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>Description</Text>
              <Text style={[styles.description, { color: theme.colors.text }]}>{product.product_description}</Text>
            </View>
          )}

          {/* Product Details */}
          <View style={[styles.detailsContainer, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.text }]}>Product ID:</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{product.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.text }]}>Category:</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{product.product_category}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button (Fixed at bottom) */}
      <View style={[styles.footer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <Pressable
          style={[styles.addToCartButton, isInCart(product.id) && styles.addToCartButtonInCart]}
          onPress={() => {
            addItem(product, 1);
            Alert.alert(
              'Added to Cart',
              `${product.product_name} has been added to your cart.`,
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.addToCartText}>
            {isInCart(product.id)
              ? `In Cart (${getItemQuantity(product.id)}) - Add More`
              : 'Add to Cart'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    textTransform: 'capitalize',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 32,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 24,
  },
  descriptionContainer: {
    marginBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  detailsContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textTransform: 'capitalize',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  addToCartButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonInCart: {
    backgroundColor: '#059669',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
