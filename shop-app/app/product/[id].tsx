import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useProduct } from '@/hooks/useProducts';
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
  const router = useRouter();
  const productId = parseInt(id || '0', 10);

  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorTitle}>Error Loading Product</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={styles.errorTitle}>Product Not Found</Text>
      </View>
    );
  }

  const imageUrl = getImageUrl(product.product_image);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.product_name,
          headerBackTitle: 'Back'
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
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
          <Text style={styles.productName}>{product.product_name}</Text>

          {/* Price */}
          <Text style={styles.price}>${product.product_price.toFixed(2)}</Text>

          {/* Description */}
          {product.product_description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{product.product_description}</Text>
            </View>
          )}

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Product ID:</Text>
              <Text style={styles.detailValue}>{product.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.product_category}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button (Fixed at bottom) */}
      <View style={styles.footer}>
        <Pressable
          style={styles.addToCartButton}
          onPress={() => {
            // TODO: Implement add to cart functionality
            alert('Add to cart functionality coming soon!');
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
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
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
