"use client";
import { useTranslation } from '@/lib/i18n-utils';

export default function OrdersPage() {
    const { t } = useTranslation();
    return (
        <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-2xl font-bold">{t('orders_title')}</h1>
        </div>
    );
}