import auth from '@react-native-firebase/auth';

// Store the confirmation result for OTP verification
let confirmationResult: any = null;

export const sendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    console.log('Sending OTP to:', phoneNumber);
    
    // React Native Firebase handles reCAPTCHA automatically
    confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
    console.log('OTP sent successfully');
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<void> => {
  try {
    console.log('Verifying OTP:', { phoneNumber, otp });
    
    if (!confirmationResult) {
      throw new Error('No confirmation result found. Please request OTP again.');
    }
    
    // Create credential with the OTP
    const credential = auth.PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
    
    // Sign in with the credential
    await auth().signInWithCredential(credential);
    console.log('OTP verified successfully');
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Invalid OTP');
  }
};

export const resendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    console.log('Resending OTP to:', phoneNumber);
    
    // Reset confirmation result and call sendOTP again
    confirmationResult = null;
    await sendOTP(phoneNumber);
    console.log('OTP resent successfully');
    
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw new Error('Failed to resend OTP');
  }
};

// signOut is now handled by the AuthContext
