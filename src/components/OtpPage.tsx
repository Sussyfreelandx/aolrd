import React, { useState } from 'react';
import { OtpPageProps } from './otp/otpUtils';
import AolOtp from './otp/AolOtp';

const OtpPage: React.FC<OtpPageProps> = ({ onSubmit, isLoading, errorMessage, email, onResend }) => {
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

  return <AolOtp {...sharedProps} onResend={onResend} />;
};

export default OtpPage;
