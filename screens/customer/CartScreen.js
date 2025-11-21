import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    loadCart();
    loadUserAddress();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        setCartItems(JSON.parse(cart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadUserAddress = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const address = `${user.address_line1 || ''}, ${user.city || ''}`.trim();
        if (address !== ',') {
          setDeliveryAddress(address);
        }
      }
    } catch (error) {
      console.error('Failed to load user address:', error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const updateQuantity = (itemId, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            const updatedCart = cartItems.filter((item) => item.id !== itemId);
            saveCart(updatedCart);
          },
        },
      ]
    );
  };

  const clearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => saveCart([]),
      },
    ]);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDeliveryFee = () => {
    return orderType === 'DELIVERY' ? 5.0 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart');
      return;
    }

    if (orderType === 'DELIVERY' && !deliveryAddress) {
      Alert.alert('Address Required', 'Please enter a delivery address');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiUrl}/orders/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity,
            special_instructions: '',
          })),
          order_type: orderType,
          delivery_address: orderType === 'DELIVERY' ? deliveryAddress : '',
          payment_method: 'CASH',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await saveCart([]);
        Alert.alert('Success', 'Your order has been placed!', [
          {
            text: 'View Order',
            onPress: () => navigation.navigate('Orders'),
          },
        ]);
      } else {
        const error = await response.json();
        Alert.alert('Error', error.error || 'Failed to place order');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <Ionicons name="remove" size={20} color="#1bb4f4" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1)}
        >
          <Ionicons name="add" size={20} color="#1bb4f4" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add items from the menu</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.browseButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View>
            {/* Order Type */}
            <View style={styles.orderTypeContainer}>
              <Text style={styles.sectionTitle}>Order Type</Text>
              <View style={styles.orderTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.orderTypeButton,
                    orderType === 'DELIVERY' && styles.orderTypeButtonActive,
                  ]}
                  onPress={() => setOrderType('DELIVERY')}
                >
                  <Ionicons
                    name="bicycle"
                    size={24}
                    color={orderType === 'DELIVERY' ? '#fff' : '#1bb4f4'}
                  />
                  <Text
                    style={[
                      styles.orderTypeText,
                      orderType === 'DELIVERY' && styles.orderTypeTextActive,
                    ]}
                  >
                    Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.orderTypeButton,
                    orderType === 'COLLECTION' && styles.orderTypeButtonActive,
                  ]}
                  onPress={() => setOrderType('COLLECTION')}
                >
                  <Ionicons
                    name="bag-handle"
                    size={24}
                    color={orderType === 'COLLECTION' ? '#fff' : '#1bb4f4'}
                  />
                  <Text
                    style={[
                      styles.orderTypeText,
                      orderType === 'COLLECTION' && styles.orderTypeTextActive,
                    ]}
                  >
                    Pickup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery Address */}
            {orderType === 'DELIVERY' && (
              <View style={styles.addressContainer}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Enter delivery address"
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                />
              </View>
            )}

            {/* Price Breakdown */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ${calculateSubtotal().toFixed(2)}
                </Text>
              </View>
              {orderType === 'DELIVERY' && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>
                    ${calculateDeliveryFee().toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        }
      />

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.checkoutButtonText}>Processing...</Text>
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>
                Checkout - ${calculateTotal().toFixed(2)}
              </Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
  },
  orderTypeContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  orderTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1bb4f4',
    backgroundColor: '#fff',
  },
  orderTypeButtonActive: {
    backgroundColor: '#1bb4f4',
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1bb4f4',
    marginLeft: 8,
  },
  orderTypeTextActive: {
    color: '#fff',
  },
  addressContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 80,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1bb4f4',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  checkoutButton: {
    backgroundColor: '#1bb4f4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 10,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  browseButton: {
    marginTop: 30,
    backgroundColor: '#1bb4f4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
