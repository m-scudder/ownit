import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import PhoneLoginScreen from './PhoneLoginScreen';
import OTPVerificationScreen from './OTPVerificationScreen';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { colors } = useTheme();

  const handlePhoneSubmitted = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentStep('otp');
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setPhoneNumber('');
  };

  const handleVerificationSuccess = () => {
    onAuthSuccess();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <View style={styles.container}>
      {currentStep === 'phone' ? (
        <PhoneLoginScreen onPhoneSubmitted={handlePhoneSubmitted} />
      ) : (
        <OTPVerificationScreen
          phoneNumber={phoneNumber}
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBackToPhone}
        />
      )}
    </View>
  );
}
