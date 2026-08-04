"use client";
import { useTranslation } from '@/lib/i18n-utils';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
    const { t } = useTranslation();
    return (
        <div className="min-h-[60vh] px-4 sm:px-6 md:px-12 max-w-5xl mx-auto py-8 pb-28 md:pb-12 text-white flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-full flex justify-start">
                <Link href="/account" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-greny transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('profile_title')}</span>
                </Link>
            </div>
            <div className="p-4 rounded-full bg-secondary/40 border border-secondary text-greny">
                <ShoppingBag className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('orders_title')}</h1>
            <p className="text-gray-400 text-sm max-w-md">Vous n'avez pas encore passé de commande.</p>
        </div>
    );
}