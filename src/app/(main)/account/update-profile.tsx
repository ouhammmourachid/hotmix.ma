"use client";
import React,{useState,useRef} from 'react';
import { Button } from "@/components/ui/button";
import { CustomInput } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import {XButton } from '@/components/small-pieces';

export default function UpdateProfile({
                                        isOpen,
                                        onClose
                                      }: Readonly<{
                                        isOpen: boolean,
                                        onClose: () => void
                                      }>) {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
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
          className='top-6 text-secondary hover:text-greny'/>
        <h1 className="text-xl font-semibold">
          Edit profile
        </h1>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              type='text'
            />
            <CustomInput
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              type='text'
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Email</label>
            <CustomInput
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type='email'
            />
            <p className="text-gray-400 text-sm">
              Email used for login can't be changed
            </p>
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
            type="submit"
            className="account_save_button"
          >
            Save
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
