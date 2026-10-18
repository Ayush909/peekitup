import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { fetchProducts } from '../services/productApi';
import { Product } from '../types/product';

function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    console.log('calling');
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProducts();
      setProducts(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading && products.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading collection...</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable
          onPress={() => void loadProducts()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR WARDROBE</Text>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Explore your next favorite look.</Text>
      </View>

      {error ? (
        <Text style={styles.warning}>
          Refresh failed. Showing the current list.
        </Text>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadProducts()}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.category}>{item.category.toUpperCase()}</Text>

            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#827363',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#25231F',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#77716A',
    marginTop: 5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
  },
  imageContainer: {
    height: 170,
    backgroundColor: '#F5F2ED',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  category: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#827363',
    marginTop: 12,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#25231F',
    marginTop: 6,
    minHeight: 36,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#25231F',
    marginTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    color: '#77716A',
  },
  error: {
    color: '#B42318',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#25231F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  warning: {
    color: '#B45309',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
