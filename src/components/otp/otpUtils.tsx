import React from 'react';

export interface OtpProviderProps {
  email?: string;
  errorMessage?: string;
  isLoading: boolean;
  otp: string;
  onOtpComplete: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend?: () => void;
}

export interface OtpPageProps {
  onSubmit: (otp: string) => void;
  isLoading: boolean;
  errorMessage?: string;
  email?: string;
  provider?: string;
  onResend?: () => void;
}

export const maskEmail = (email: string) => {
  const [user, domain] = email.split('@');
  if (!domain) return email;
  const visible = user.length <= 2 ? user[0] : user.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 1))}@${domain}`;
};

export const maskPhone = (seedEmail: string) => {
  const hash = Array.from(seedEmail).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const last4 = String(hash).slice(-4).padStart(4, '0');
  return `(•••) •••-${last4}`;
};

export const UserAvatar: React.FC<{ email: string; size?: number }> = ({ email, size = 40 }) => {
  const initial = email.charAt(0).toUpperCase();
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#720e9e', '#39007E', '#FF6D01', '#46BDC6'];
  const colorIndex = Array.from(email).reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: colors[colorIndex], fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  );
};
