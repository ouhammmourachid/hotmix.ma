"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check, X, Loader2 } from 'lucide-react';
import styles from '@/styles/main.module.css';
import pb from '@/lib/pocketbase';
import { useTranslation } from '@/lib/i18n-utils';

export default function NewsletterForm() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            await pb.collection('subscribers').create({ email });
            setStatus('success');
            setEmail('');
        } catch (error: any) {
            console.error('Newsletter subscription error:', error);
            setStatus('error');
            // PocketBase error handling
            if (error?.response?.data?.email?.code === 'validation_is_email') {
                setErrorMessage('Invalid email format');
            } else if (error?.response?.data?.email?.code === 'validation_not_unique') {
                setErrorMessage('You are already subscribed!');
            } else {
                setErrorMessage('Failed to subscribe. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
                {t('footer_newsletter_title')}
            </h3>
            <p className="text-gray-300">
                {t('footer_newsletter_description')}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex bg-white p-2 rounded-sm items-center">
                    <Input
                        type="email"
                        placeholder={t('footer_email_placeholder')}
                        className={styles.footer_subscribe_input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || status === 'success'}
                    />
                    <Button
                        type="submit"
                        className={styles.footer_subscribe_button}
                        disabled={isLoading || status === 'success'}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : status === 'success' ? (
                            <>
                                {t('footer_subscribe')} <Check className="ml-2 w-4 h-4" />
                            </>
                        ) : (
                            <>
                                {t('footer_subscribe')} <ArrowUpRight className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
                {status === 'success' && (
                    <p className="text-green-500 text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> Subscribed successfully!
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <X className="w-4 h-4" /> {errorMessage}
                    </p>
                )}
            </form>
        </div>
    );
}
