import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const menuItems = {
    appetizers: [
      { name: 'Classic Bruschetta', price: '$8.99', tag: '🌱 Vegetarian' },
      { name: 'French Onion Soup', price: '$9.99', tag: '⭐ Popular' },
      { name: 'Buffalo Wings', price: '$12.99', tag: '🌶️ Spicy' },
    ],
    mains: [
      { name: 'Grilled Ribeye Steak', price: '$34.99', tag: '👨‍🍳 Chef Special' },
      { name: 'Grilled Salmon', price: '$28.99', tag: '💚 Healthy' },
      { name: 'Margherita Pizza', price: '$16.99', tag: '⭐ Popular' },
      { name: 'Truffle Pasta', price: '$24.99', tag: '✨ Premium' },
    ],
    desserts: [
      { name: 'Classic Tiramisu', price: '$8.99', tag: '⭐ Popular' },
      { name: 'Cheesecake', price: '$9.99', tag: '👨‍🍳 Chef Special' },
      { name: 'Chocolate Lava Cake', price: '$10.99', tag: '🍫 Indulgent' },
    ],
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'mains', name: 'Main Course', icon: '🍖' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
  ];

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return Object.entries(menuItems).flatMap(([category, items]) =>
        items.map(item => ({ ...item, category }))
      );
    }
    return menuItems[selectedCategory] || [];
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Menu</Text>
        <Text style={styles.headerSubtitle}>Discover our delicious selection</Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Menu Items */}
      <ScrollView style={styles.menuList}>
        {getFilteredItems().map((item, index) => (
          <View key={index} style={styles.menuCard}>
            <View style={styles.menuContent}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.tag && <Text style={styles.itemTag}>{item.tag}</Text>}
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ccc',
  },
  categoryScroll: {
    backgroundColor: '#f8f9fa',
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#1bb4f4',
    borderColor: '#1bb4f4',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  categoryTextActive: {
    color: '#fff',
  },
  menuList: {
    flex: 1,
    padding: 15,
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemTag: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1bb4f4',
  },
  addButton: {
    backgroundColor: '#1bb4f4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
