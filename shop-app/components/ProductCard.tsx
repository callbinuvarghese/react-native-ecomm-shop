import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Product } from '@/lib/types';
import { config } from '@/lib/config';

interface ProductCardProps {
  product: Product;
}

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

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getImageUrl(product.product_image);

  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.product_name}
          </Text>
          <Text style={styles.category}>{product.product_category}</Text>
          <View style={styles.footer}>
            <Text style={styles.price}>${product.product_price.toFixed(2)}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});
