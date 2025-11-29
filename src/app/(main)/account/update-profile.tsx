"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CustomInput } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import { XButton } from '@/components/small-pieces';
import useAuth from "@/hooks/useAuth";
import pb from "@/lib/pocketbase";

export default function UpdateProfile({
  isOpen,
  onClose
}: Readonly<{
  isOpen: boolean,
  onClose: () => void
}>) {
  const modalRef = useRef(null);
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await pb.collection('users').update(user.id, {
        name: name
      });
      // Refresh auth store to update UI
      await pb.collection('users').authRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      cursorPadding={20}
      className="account_modal">
      <div
        ref={modalRef}
        className="account_modal_content">
        <XButton
          onClick={onClose}
          className='top-6 text-secondary hover:text-greny' />
        <h1 className="text-xl font-semibold">
          Edit profile
        </h1>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Full Name</label>
            <CustomInput
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
            />
          </div>
        </div>
        {/* Save and Cancel buttons */}
        <div className="account_save_cancel">
          <Button
            onClick={onClose}
            type="button"
            variant="ghost"
            className="account_cancel_button">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="account_save_button"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
