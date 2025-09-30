import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import * as SMS from 'expo-sms';
import { verifyOTP, resendOTP } from '@/utils/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { LoggedOutStackScreenProps } from '../types/navigation';

export default function OTPVerificationScreen() {
  const navigation = useNavigation<LoggedOutStackScreenProps<'OTPVerification'>['navigation']>();
  const route = useRoute<LoggedOutStackScreenProps<'OTPVerification'>['route']>();
  const phoneNumber = route.params.phoneNumber;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const inputRef = useRef<TextInput>(null);

  // Auto-read SMS functionality
  useEffect(() => {
    const startSMSListener = async () => {
      try {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          // Note: Auto-reading SMS requires additional native configuration
          // For now, we'll just focus on manual input
          console.log('SMS reading capability available');
        }
      } catch (error) {
        console.log('SMS reading not available:', error);
      }
    };

    startSMSListener();
  }, []);

  // Timer for resend functionality
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-verify when OTP reaches 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phoneNumber, otp);
      // Sign in the user after successful OTP verification
      await signIn(phoneNumber);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await resendOTP(phoneNumber);
      setTimeLeft(60);
      setCanResend(false);
      setOtp('');
      Alert.alert('Success', 'OTP has been resent');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericText);
  };

  const formatPhoneNumber = (phone: string) => {
    // Format Indian phone number for display (+91XXXXXXXXXX)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
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
    backButton: {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: 8,
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
      marginBottom: 8,
    },
    phoneNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      textAlign: 'center',
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
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      paddingVertical: 16,
      textAlign: 'center',
      letterSpacing: 4,
    },
    otpIcon: {
      marginRight: 12,
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
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    resendContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    resendButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    resendText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    resendTextDisabled: {
      color: colors.subtext,
    },
    timerText: {
      color: colors.subtext,
      fontSize: 14,
      marginTop: 8,
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to
        </Text>
        <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Verification Code</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="keypad-outline"
            size={20}
            color={colors.subtext}
            style={styles.otpIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="000000"
            placeholderTextColor={colors.subtext}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            editable={!loading}
            selectTextOnFocus
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, (loading || otp.length !== 6) && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={loading || otp.length !== 6}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOTP}
          disabled={!canResend || resendLoading}
        >
          <Text style={[styles.resendText, (!canResend || resendLoading) && styles.resendTextDisabled]}>
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
        {!canResend && (
          <Text style={styles.timerText}>
            Resend available in {timeLeft}s
          </Text>
        )}
      </View>

      <Text style={styles.infoText}>
        The code will be automatically verified when you enter all 6 digits.
      </Text>
    </KeyboardAvoidingView>
  );
}
