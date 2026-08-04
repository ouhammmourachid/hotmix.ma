import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomInput } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import { XButton } from '@/components/small-pieces';
import { SelectCity, SelectCountry } from '@/components/select';
import { useTranslation } from '@/lib/i18n-utils';

export default function AddAddress({ isOpen, onClose }: Readonly<{ isOpen: boolean, onClose: () => void }>) {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    codePostal: "",
    phone: "",
    default: true
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
          className='top-6 text-secondary hover:text-greny' />
        <div>
          <h1 className="text-xl font-semibold text-white">
            {t('address_add_title')}
          </h1>

        </div>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="default"
              checked={formData.default}
              onChange={() => setFormData({ ...formData, default: !formData.default })}
              className="border-gray-400 data-[state=checked]:bg-greny data-[state=checked]:border-greny" />
            <label htmlFor="default" className="text-sm text-gray-300">
              {t('address_default_checkbox')}
            </label>
          </div>
          <SelectCountry />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <CustomInput
              placeholder={t('address_first_name')}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              type='text' />
            <CustomInput
              placeholder={t('address_last_name')}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              type='text' />
          </div>
          <CustomInput
            placeholder={t('address_street')}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            type='text' />
          <CustomInput
            placeholder={t('address_apartment')}
            value={formData.apartment}
            onChange={(e) =>
              setFormData({ ...formData, apartment: e.target.value })
            }
            type='text' />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <SelectCity />
            <CustomInput
              placeholder={t('address_postal_code')}
              value={formData.codePostal}
              onChange={(e) =>
                setFormData({ ...formData, codePostal: e.target.value })
              }
              type='text' />
          </div>
          <CustomInput
            placeholder={t('address_phone')}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            type='text' />
        </div>
        <div className="account_save_cancel">
          <Button
            onClick={onClose}
            type="button"
            variant="ghost"
            className="account_cancel_button">
            {t('profile_cancel')}
          </Button>
          <Button
            type="submit"
            className="account_save_button">
            {t('profile_save')}
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
