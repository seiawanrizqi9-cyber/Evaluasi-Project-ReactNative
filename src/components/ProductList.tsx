import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Product } from '../screens/HomeScreen';
import ProductCard from './ProductCard';
import { colors } from '../color/colors';

interface Props {
  products: Product[];
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 3;

export default function ProductList({ products }: Props) {
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛍️</Text>
        <Text style={styles.emptyText}>Belum ada produk</Text>
        <Text style={styles.emptySubtext}>Tambahkan produk pertama Anda</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <ProductCard product={item} />
        </View>
      )}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 12,
  },
  gridItem: {
    width: itemWidth,
    margin: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.text,
  },
  emptySubtext: {
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 14,
  },
});