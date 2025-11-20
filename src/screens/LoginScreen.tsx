import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

type LoginScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Login'>;

// Dummy accounts untuk testing - PASTIKAN INI BENAR
const dummyAccounts = [
  {
    username: 'kminchelle',
    password: '0lelplR',
    description: 'Demo user from DummyJSON'
  },
  {
    username: 'emilys',
    password: 'emilyspass',
    description: 'Another demo user'
  }
];

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();

  const fillDemoAccount = (accountIndex: number = 0) => {
    const account = dummyAccounts[accountIndex];
    setUsername(account.username);
    setPassword(account.password);
    Alert.alert('Demo Account', `Account filled: ${account.description}`);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and Password are required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username.trim(), password.trim());
      
      Alert.alert('Login Success', `Welcome back, ${result.user.firstName}! 🎉`);
      
      // Navigate back to previous screen or home
      navigation.goBack();
      
    } catch (error: any) {
      console.error('Login screen error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome6 name="arrow-left" size={20} color={colors.textOnPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <TouchableOpacity onPress={clearForm}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome6 name="circle-user" size={50} color={colors.textOnPrimary} />
            </View>
          </View>

          <Text style={styles.loginTitle}>Login to Your Account</Text>
          <Text style={styles.loginSubtitle}>
            Access all Shopping App features
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              autoComplete="username"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textLight}
              autoComplete="password"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Login</Text>
            
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoAccount(0)}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>🚀 Use: kminchelle / 0lelplR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoAccount(1)}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>🚀 Use: emilys / emilyspass</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoInfoTitle}>Valid DummyJSON Accounts:</Text>
            <Text style={styles.demoInfoText}>• kminchelle / 0lelplR</Text>
            <Text style={styles.demoInfoText}>• emilys / emilyspass</Text>
            <Text style={styles.demoInfoNote}>
              Using real DummyJSON API - Live authentication
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  clearText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
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
  demoSection: {
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  demoButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
  demoInfoNote: {
    fontSize: 10,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});