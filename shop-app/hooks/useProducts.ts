import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById, fetchCategories, fetchProductsByCategory } from '@/lib/api';

export function useProducts(category?: string) {
  return useQuery({
    queryKey: category ? ['products', 'category', category] : ['products'],
    queryFn: category ? () => fetchProductsByCategory(category) : fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes (categories change rarely)
  });
}
