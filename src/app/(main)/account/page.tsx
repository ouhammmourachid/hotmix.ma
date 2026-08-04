"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UpdateProfile from './update-profile';
import { Button } from '@/components/ui/button';
import { Pencil, User, Mail, Heart, LogOut, ChevronRight } from 'lucide-react';
import useAuth from "@/hooks/useAuth";
import { useTranslation } from '@/lib/i18n-utils';
import Link from 'next/link';

export default function ProfilePage() {
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const userInitial = (user?.name || user?.username || user?.email || 'U')[0].toUpperCase();

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-12 lg:px-24 py-6 sm:py-10 max-w-5xl mx-auto space-y-6 pb-28 md:pb-12 text-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-secondary/40 p-4 sm:p-6 rounded-2xl border border-secondary">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-greny/20 border-2 border-greny flex items-center justify-center text-greny text-2xl font-bold shrink-0">
            {userInitial}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{user?.name || user?.username || t('profile_title')}</h1>
            <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate max-w-[220px] sm:max-w-xs">{user?.email}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            onClick={() => setIsModalInfoOpen(true)}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none border-greny text-greny hover:bg-greny hover:text-white transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm py-2 px-4.5">
            <Pencil size={14} />
            <span>{t('profile_edit_title')}</span>
          </Button>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2 px-3.5">
            <LogOut size={14} />
            <span>{t('nav_logout')}</span>
          </Button>
        </div>
      </div>

      {/* Main Profile Details Card */}
      <Card className="bg-secondary/20 border-secondary border rounded-2xl shadow-md overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b border-secondary pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-greny" />
            {t('profile_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-primary/50 p-4 rounded-xl border border-secondary/50">
              <label className="text-xs uppercase tracking-wider text-gray-400 block mb-1">{t('profile_name')}</label>
              <span className="text-base font-medium text-white block truncate">{user?.name || user?.username || '-'}</span>
            </div>
            <div className="bg-primary/50 p-4 rounded-xl border border-secondary/50">
              <label className="text-xs uppercase tracking-wider text-gray-400 block mb-1">{t('profile_email')}</label>
              <span className="text-base font-medium text-white block truncate">{user?.email || '-'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Wishlist Card */}
        <Link
          href="/wishlist"
          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 border border-secondary transition-all text-left group">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-greny/10 text-greny group-hover:bg-greny group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">{t('side_menu_wishlist')}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{t('wishlist_subtitle')}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-greny transition-colors" />
        </Link>
      </div>

      {/* Modals */}
      <UpdateProfile
        isOpen={isModalInfoOpen}
        onClose={() => setIsModalInfoOpen(false)}
      />
    </div>
  );
}



