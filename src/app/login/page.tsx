'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, Loader2, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function TailorLogin() {
    const router = useRouter();
    const [step, setStep] = useState<'contact' | 'otp'>('contact');
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [userType, setUserType] = useState<'admin' | 'tailor'>('admin');

    useEffect(() => {
        if (document.cookie.includes('isLogined=true')) {
            router.push('/callback');
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {

            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const apiPrefix = userType === 'admin' ? '/auth' : '/auth/tailor';

    const sendOtpMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`http://34.18.73.81${apiPrefix}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact }),

            });
            const data = await response.json();
            if (!response.ok || data.type === 'error') {
                if (response.status == 429) {
                    throw new Error('Too many OTP\'s sent! Please try again after 30 seconds.');
                } else {
                    throw new Error(data.message || 'Login failed. Please check your credentials and try again.');
                }
            }
            return data;
        },
        onSuccess: () => {
            setStep('otp');
            setError('');
            setResendTimer(30);
        },
        onError: (err) => setError(err.message),
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`http://34.18.73.81${apiPrefix}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ contact, otp }),

            });
            const data = await response.json();
            if (!response.ok || data.type === 'error') {
                if (response.status == 429) {
                    throw new Error('Too many OTP\'s sent! Please try again after 30 seconds.');
                } else {
                    throw new Error(data.message || 'Invalid OTP');
                }
            }
            localStorage.setItem('isLogined', 'true');
            return data;

        },
        onSuccess: () => {
            if (userType === 'tailor') {
                router.push('/tailor');
            } else {
                router.push('/dashboard');
            }
        },
        onError: (err) => setError(err.message),
    });

    const resendOtpMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`http://34.18.73.81${apiPrefix}/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact }),

            });
            const data = await response.json();
            if (!response.ok || data.type === 'error') {
                if (response.status == 429) {
                    throw new Error('Too many OTP\'s sent! Please try again after 30 seconds.');
                } else {
                    throw new Error(data.message || 'Invalid OTP');
                }
            }
            return data;
        },
        onSuccess: () => setResendTimer(30),
        onError: (err) => setError(err.message),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 transition-all duration-500">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={clsx(
                    'max-w-md w-full space-y-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 transition-all duration-500',
                    { 'scale-95 opacity-80': sendOtpMutation.isPending || verifyOtpMutation.isPending }
                )}
            >
                {step === 'contact' && (
                    <div className="grid grid-cols-2 p-4 gap-2">
                        <button
                            onClick={() => setUserType('admin')}

                            className={clsx(
                                'w-full py-2 px-4 rounded-md text-white transition-all',
                                userType === 'admin' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                            )}
                        >
                            Login as Admin
                        </button>
                        <button
                            onClick={() => setUserType('tailor')}
                            className={clsx(
                                'w-full py-2 px-4 rounded-md text-white transition-all',
                                userType === 'tailor' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                            )}
                        >
                            Login as Tailor
                        </button>
                    </div>
                )}

                <div className="space-y-8 p-8">

                    {step === 'otp' && (
                        <button
                            onClick={() => setStep('contact')}
                            className="flex items-center text-blue-400 hover:text-blue-500 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" /> Back
                        </button>
                    )}
                    <h2 className="text-center text-3xl font-bold text-white transition-all duration-500">
                        {step === 'contact' ? 'Sign in with Contact' : 'Enter OTP'}
                    </h2>

                    {error && (
                        <div className="rounded-md bg-red-900/50 p-4">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {step === 'contact' ? (
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); sendOtpMutation.mutate(); }}>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                                inputMode='numeric'
                                pattern='[0-9]*'
                            />
                            <button
                                type="submit"

                                disabled={sendOtpMutation.isPending}
                                className="w-full flex justify-center py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                            >
                                {sendOtpMutation.isPending ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); verifyOtpMutation.mutate(); }}>
                            {sendOtpMutation.data && (
                                <div className="rounded-md bg-green-900/50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-400">
                                                {sendOtpMutation.data.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                inputMode='numeric'
                                pattern='[0-9]*'
                            />
                            <button
                                type="submit"
                                disabled={verifyOtpMutation.isPending}
                                className="w-full flex justify-center py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                            >
                                {verifyOtpMutation.isPending ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                            </button>
                            <button
                                type="button"
                                disabled={resendTimer > 0 || resendOtpMutation.isPending}
                                onClick={() => resendOtpMutation.mutate()}
                                className="w-full flex justify-center py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-all disabled:opacity-50"
                            >
                                {resendOtpMutation.isPending ? <Loader2 className="animate-spin" /> : `Resend OTP (${resendTimer}s)`}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
