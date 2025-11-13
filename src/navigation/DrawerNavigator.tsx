import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomDrawerContent from '../components/CustomDrawerContent';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { colors } from '../color/colors';
import { RootDrawerParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../utils/useCart';

const SETTINGS_STORAGE_KEY = '@app_settings';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

// ✅ PERBAIKAN 1: KELUARKAN KOMPONEN DARI RENDER
const HeaderLeft = ({ navigation }: { navigation: any }) => (
  <FontAwesome6
    name="bars"
    size={24}
    color={colors.textOnPrimary}
    style={styles.headerLeftIcon}
    onPress={() => navigation.toggleDrawer()}
  />
);

// ✅ PERBAIKAN 2: TouchableCartIcon SEBAGAI KOMPONEN TERPISAH
interface TouchableCartIconProps {
  getTotalItems: () => number;
  onPress: () => void;
}

const TouchableCartIcon: React.FC<TouchableCartIconProps> = ({ 
  getTotalItems, 
  onPress 
}) => {
  const totalItems = getTotalItems();

  return (
    <View style={styles.cartContainer}>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome6
          name="cart-shopping"
          size={24}
          color={colors.textOnPrimary}
        />
      </TouchableOpacity>
      {totalItems > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
};

// ✅ PERBAIKAN 3: HeaderRight SEBAGAI KOMPONEN TERPISAH
interface HeaderRightProps {
  navigation: any;
  getTotalItems: () => number;
}

const HeaderRight: React.FC<HeaderRightProps> = ({ 
  navigation, 
  getTotalItems 
}) => (
  <View style={styles.headerRightContainer}>
    <FontAwesome6
      name="magnifying-glass"
      size={24}
      color={colors.textOnPrimary}
      style={styles.headerRightIcon}
      onPress={() => console.log('Search pressed')}
    />
    <TouchableCartIcon
      getTotalItems={getTotalItems}
      onPress={() => navigation.navigate('Checkout')}
    />
  </View>
);

// ✅ PERBAIKAN 4: ModalHeaderLeft SEBAGAI KOMPONEN TERPISAH - DIUBAH UNTUK NAVIGATE KE HOME
interface ModalHeaderLeftProps {
  navigation: any;
}

const ModalHeaderLeft: React.FC<ModalHeaderLeftProps> = ({ navigation }) => (
  <TouchableOpacity 
    onPress={() => navigation.navigate('Home')} // ✅ NAVIGATE KE HOME
    style={styles.modalCloseButton}
  >
    <FontAwesome6 name="arrow-left" size={20} color={colors.textOnPrimary} />
  </TouchableOpacity>
);

// ✅ PERBAIKAN 5: BUAT SCREEN OPTIONS SEBAGAI FUNGSI TERPISAH
const createScreenOptions = (getTotalItems: () => number, swipeEnabled: boolean) => {
  return ({ navigation, route }: any) => ({
    drawerStyle: {
      backgroundColor: colors.card,
      width: 320,
    },
    drawerActiveTintColor: colors.primary,
    drawerInactiveTintColor: colors.text,
    headerStyle: {
      backgroundColor: colors.primary,
      elevation: 0,
      shadowOpacity: 0,
      height: 70,
    },
    headerTintColor: colors.textOnPrimary,
    headerTitleStyle: {
      fontWeight: 'bold' as const,
      fontSize: 18,
    },
    headerTitleAlign: 'center' as const,
    
    // ✅ HEADER COMPONENTS - SEKARANG STABIL
    headerLeft: () => <HeaderLeft navigation={navigation} />,
    headerRight: () => (
      <HeaderRight navigation={navigation} getTotalItems={getTotalItems} />
    ),
    headerTitle: route.params?.headerTitle || 'Belanja Skuy',
    
    // ✅ GESTURE CONFIGURATION
    swipeEnabled: swipeEnabled,
    swipeEdgeWidth: swipeEnabled ? 30 : 0,
    drawerType: 'front' as const,
    
    // ✅ OPTIMASI PERFORMANCE
    lazy: true,
    detachInactiveScreens: true,
  });
};

// ✅ PERBAIKAN 6: BUAT OPTIONS UNTUK CHECKOUT SCREEN SEBAGAI FUNGSI TERPISAH - DIUBAH
const getCheckoutOptions = ({ navigation }: any) => ({
  title: 'Keranjang Belanja',
  headerShown: true,
  headerLeft: () => (
    <ModalHeaderLeft navigation={navigation} /> // ✅ PASS NAVIGATION PROP
  ),
  swipeEnabled: false,
});

// ✅ HOOK UNTUK SWIPE SETTINGS TETAP DI DALAM
const useSwipeSettings = () => {
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  const loadSwipeSetting = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setSwipeEnabled(settings.swipeDrawer);
      }
    } catch (error) {
      console.error('Gagal load swipe setting:', error);
    }
  };

  useEffect(() => {
    loadSwipeSetting();

    const interval = setInterval(() => {
      loadSwipeSetting();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return swipeEnabled;
};

export default function DrawerNavigator() {
  const swipeEnabled = useSwipeSettings();
  const { getTotalItems } = useCart();

  // ✅ PERBAIKAN 7: GUNAKAN FUNGSI YANG SUDAH DIBUAT
  const screenOptions = createScreenOptions(getTotalItems, swipeEnabled);

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={screenOptions}
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          title: 'Beranda',
          headerShown: true,
        }}
        initialParams={{
          userID: 'U123',
          fromDrawer: 'Data dari Root Drawer',
          timestamp: new Date().toISOString(),
          featureFlags: {
            enableNewUI: true,
            enableAnalytics: true,
            experimentalFeatures: false,
          },
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Pengaturan',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Tentang Kami',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Checkout"
        component={CheckoutScreen}
        // ✅ PERBAIKAN 8: GUNAKAN FUNGSI YANG SUDAH DIBUAT, BUKAN INLINE FUNCTION
        options={getCheckoutOptions}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeftIcon: {
    marginLeft: 15,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerRightIcon: {
    marginRight: 20,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.textOnPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginLeft: 15,
    padding: 8,
  },
});