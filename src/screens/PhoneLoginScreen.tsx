import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { sendOTP } from '@/utils/auth';
import { useNavigation } from '@react-navigation/native';
import { LoggedOutStackScreenProps } from '../types/navigation';

export default function PhoneLoginScreen() {
  const navigation = useNavigation<LoggedOutStackScreenProps<'PhoneLogin'>['navigation']>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters and limit to 10 digits
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    
    // Add +91 country code for Indian numbers
    if (cleaned.length > 0) {
      return '+91' + cleaned;
    }
    return '+91';
  };

  const handlePhoneNumberChange = (text: string) => {
    // Only allow numeric input and limit to 10 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(numericText);
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    setLoading(true);
    try {
      await sendOTP(formattedPhone);
      navigation.navigate('OTPVerification', { phoneNumber: formattedPhone });
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
      textAlign: 'center',
      lineHeight: 24,
    },
    inputContainer: {
      marginBottom: 32,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 16,
    },
    phoneIcon: {
      marginRight: 12,
    },
    countryCode: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '600',
      marginRight: 8,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    buttonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.7,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextDisabled: {
      color: colors.subtext,
      fontSize: 16,
      fontWeight: '600',
    },
    loadingText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    infoText: {
      fontSize: 14,
      color: colors.subtext,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to OwnIt</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to get started with building better habits
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="call-outline"
            size={20}
            color={colors.subtext}
            style={styles.phoneIcon}
          />
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="9876543210"
            placeholderTextColor={colors.subtext}
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="number-pad"
            maxLength={10}
            autoFocus
            editable={!loading}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, (loading || phoneNumber.length !== 10) && styles.buttonDisabled]}
        onPress={handlePhoneSubmit}
        disabled={loading || phoneNumber.length !== 10}
      >
        <Text style={
          loading 
            ? styles.loadingText 
            : (phoneNumber.length !== 10) 
              ? styles.buttonTextDisabled 
              : styles.buttonText
        }>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        We'll send you a verification code via SMS to confirm your phone number.
      </Text>
    </KeyboardAvoidingView>
  );
}
