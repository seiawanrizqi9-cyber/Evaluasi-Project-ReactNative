import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { colors } from './src/color/colors';
import { CartProvider } from './src/utils/useCart';

const getActiveRouteName = (state: NavigationState): string => {
  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }

  return route.name;
};

export default function App() {
  // ✅ TAMBAH: Di bagian handleNavigationStateChange
  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = getActiveRouteName(state);

      // 🎯 TAHAP 4: ENHANCED ANALYTICS TRACKING
      console.log(`[ANALYTICS] Route Visited: ${currentRouteName}`);
      console.log(`[ANALYTICS] Timestamp: ${new Date().toISOString()}`);
      console.log(`[ANALYTICS] User Session: Active`);

      // Enhanced tracking dengan lebih detail
      if (currentRouteName.includes('ProductDetail')) {
        console.log(
          '[ANALYTICS] Product Detail View - Tracking product engagement',
        );
      } else if (currentRouteName.includes('Checkout')) {
        console.log('[ANALYTICS] Checkout Screen - Tracking conversion funnel');
      } else if (currentRouteName === 'Home') {
        console.log('[ANALYTICS] Home Screen - Main entry point tracking');
      } else if (currentRouteName.includes('Profile')) {
        console.log('[ANALYTICS] Profile Screen - User activity tracking');
      } else if (currentRouteName.includes('Popular')) {
        console.log('[ANALYTICS] Popular Tab - High engagement content');
      }

      // Track navigation depth
      const navigationDepth = state.routes.length;
      console.log(`[ANALYTICS] Navigation Depth: ${navigationDepth}`);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent
      />
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaView style={styles.safeArea}>
          <CartProvider>
            <NavigationContainer onStateChange={handleNavigationStateChange}>
              <DrawerNavigator />
            </NavigationContainer>
          </CartProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
