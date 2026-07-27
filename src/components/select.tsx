"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n-utils";

export function SelectCountry() {
  const { t } = useTranslation();
  return (
    <Select>
      <SelectTrigger className="select_trigger">
        <SelectValue
          defaultValue="morocco"
          placeholder={t('address_select_country')} />
      </SelectTrigger>
      <SelectContent className="select_content">
        <SelectGroup>
          <SelectItem value="morocco">{t('country_morocco')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SelectCity() {
  const { t } = useTranslation();
  return (
    <Select>
      <SelectTrigger className="select_trigger">
        <SelectValue placeholder={t('address_select_city')} />
      </SelectTrigger>
      <SelectContent className="select_content">
        <SelectGroup>
          <SelectItem value="casablanca">{t('city_casablanca')}</SelectItem>
          <SelectItem value="rabat">{t('city_rabat')}</SelectItem>
          <SelectItem value="marrakech">{t('city_marrakech')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
