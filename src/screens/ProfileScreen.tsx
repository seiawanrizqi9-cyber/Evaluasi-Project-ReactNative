import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';
import AuthGuard from '../components/AuthGuard';
import { User } from '../utils/useAuth';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../navigation/types';

// ✅ PERBAIKAN: Type untuk route params
type ProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'Profile'>;

// KOMPONEN FORM LOGIN
const LoginForm: React.FC<{
  onLogin: (email: string, password: string, name: string) => void;
  isLoading?: boolean;
}> = ({ onLogin, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const useDemoAccount = () => {
    setName('John Doe');
    setEmail('demo@belanja-skuy.com');
    setPassword('demo123');
    Alert.alert('Akun Demo', 'Form telah diisi dengan akun demo!');
  };

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    onLogin(email, password, name);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil 👤</Text>
          <Text style={styles.headerSubtitle}>
            Masuk untuk mengakses profil Anda
          </Text>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome6 name="circle-user" size={50} color={'#ffffffff'} />
            </View>
          </View>

          <Text style={styles.loginTitle}>Masuk ke Akun Anda</Text>
          <Text style={styles.loginSubtitle}>
            Akses semua fitur Belanja Skuy
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap (Opsional)"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textLight}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textLight}
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textLight}
            autoComplete="password"
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Memproses...' : 'Masuk / Daftar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={useDemoAccount}>
            <Text style={styles.demoButtonText}>🚀 Pakai Akun Demo</Text>
          </TouchableOpacity>

          <Text style={styles.loginNote}>
            Dengan masuk, Anda menyetujui Syarat & Ketentuan kami
          </Text>

          <View style={styles.demoInfo}>
            <Text style={styles.demoInfoTitle}>Info Akun Demo:</Text>
            <Text style={styles.demoInfoText}>Nama: John Doe (opsional)</Text>
            <Text style={styles.demoInfoText}>
              Email: demo@belanja-skuy.com
            </Text>
            <Text style={styles.demoInfoText}>Password: demo123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// KOMPONEN PROFIL SETELAH LOGIN - DENGAN PARAMS
const ProfileContent: React.FC<{
  user: User | null;
  onLogout: () => void;
  onEditProfile: () => void;
}> = ({ user, onLogout, onEditProfile }) => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { userID, fromDrawer, timestamp } = route.params || {};

  React.useEffect(() => {
    console.log('📊 ProfileScreen Parameters:', {
      userID,
      fromDrawer,
      timestamp,
      hasUser: !!user,
      userEmail: user?.email,
    });
  }, [userID, fromDrawer, timestamp, user]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil 👤</Text>
        <Text style={styles.headerSubtitle}>Kelola informasi akun Anda</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {/* ✅ TAMPILKAN USERID DARI PARAMS */}
          {userID && (
            <View style={styles.userIdBadge}>
              <Text style={styles.userIdText}>ID: {userID}</Text>
              {fromDrawer && (
                <Text style={styles.userIdSubtext}>(Dari Drawer)</Text>
              )}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitleCenter}>Informasi Profil</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nama Lengkap</Text>
            <Text style={styles.infoValue}>{user?.name || 'Belum diatur'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Telepon</Text>
            <Text style={styles.infoValue}>
              {user?.phone || 'Belum diatur'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Alamat</Text>
            <Text style={styles.infoValue}>
              {user?.address || 'Belum diatur'}
            </Text>
          </View>

          {/* ✅ TAMBAH INFO PARAMETER DARI NAVIGATION */}
          {userID && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>User ID System</Text>
              <Text style={[styles.infoValue, styles.userIdHighlight]}>
                {userID}
              </Text>
            </View>
          )}

          {timestamp && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data Loaded</Text>
              <Text style={styles.infoValue}>
                {new Date(timestamp).toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Text style={styles.editButtonText}>✏️ Edit Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>🚪 Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Aktivitas Anda</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Pesanan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Favorit</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Diskon</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Tahun</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// KOMPONEN UTAMA
export default function ProfileScreen() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const userData: User = {
        name: name || email.split('@')[0],
        email,
        phone: '',
        address: '',
      };
      await login(userData);
      Alert.alert('Sukses', 'Login berhasil! 🎉');
    } catch (error) {
      Alert.alert('Error', 'Gagal login, coba lagi nanti');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            Alert.alert('Sukses', 'Anda telah berhasil keluar');
          } catch (error) {
            Alert.alert('Error', 'Gagal keluar, coba lagi');
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Info', 'Fitur edit profil akan segera hadir!');
  };

  if (!isLoggedIn) {
    return (
      <AuthGuard isAuthenticated={false}>
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      </AuthGuard>
    );
  }

  return (
    <ProfileContent
      user={user}
      onLogout={handleLogout}
      onEditProfile={handleEditProfile}
    />
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  userIdBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    marginTop: 8,
    alignItems: 'center',
  },
  userIdText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  userIdSubtext: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  loginCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  loginButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  demoButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 8,
  },
  demoInfoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  demoInfoText: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 2,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginNote: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  sectionTitleCenter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  userIdHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.error + '15',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});
