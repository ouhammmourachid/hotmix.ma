"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UpdateProfile from './update-profile';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const { user } = useAuth();

  const handleClickPensil = () => {
    setIsModalInfoOpen(!isModalInfoOpen);
    setIsModalAddressOpen(false);
  }
  const handleClickAdress = () => {
    setIsModalAddressOpen(!isModalAddressOpen);
    setIsModalInfoOpen(false);
  }
  return (
    <div className="min-h-screen p-8 space-y-8 px-44">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <Card className="bg-secondary border-none shadow-lg">
        <CardContent className="p-6">
          {/* Name Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-gray-300">Name</label>
              <Button
                onClick={handleClickPensil}
                variant="ghost"
                size="icon"
                className="text-greny hover:text-greny/70">
                <Pencil size={16} />
              </Button>
            </div>
            <span className="text-gray-300">{user?.name || user?.username}</span>
          </div>
          {/* Email Section */}
          <div className="mb-6">
            <label className="block text-gray-300">Email</label>
            <span className="text-gray-300">{user?.email}</span>
          </div>
        </CardContent>
      </Card>
      <UpdateProfile
        isOpen={isModalInfoOpen}
        onClose={handleClickPensil} />
    </div>
  );
}
