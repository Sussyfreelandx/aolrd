import React, { useState } from 'react';
import { OtpPageProps } from '../otp/otpUtils';
import MobileAolOtp from '../otp/MobileAolOtp';

const MobileOtpPage: React.FC<OtpPageProps> = ({ onSubmit, isLoading, errorMessage, email, onResend }) => {
  const [otp, setOtp] = useState('');

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length >= 6) {
      onSubmit(otp);
    }
  };

  const sharedProps = { email, errorMessage, isLoading, otp, onOtpComplete: handleOtpComplete, onSubmit: handleSubmit };

  return <MobileAolOtp {...sharedProps} onResend={onResend} />;
};

export default MobileOtpPage;
