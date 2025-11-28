import { motion } from "framer-motion";
import { useRef } from "react";
import styles from "@/styles/payment.module.css";
import { useTranslation } from "@/lib/i18n-utils";
import { storeConfig } from "@/config/store-config";

export default function CollapsibleBankTransfer({
                                            formData,
                                            setFormData,
                                            isOpen,
                                            first=false
                                        }:{
                                            formData:any,
                                            setFormData:any,
                                            isOpen:boolean,
                                            first?:boolean
                                        }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const handleClickPaymentChoice = (e:any) => {
        setFormData({...formData, payment: { ...formData.payment, method: "Bank Transfer" }});
    }
    return (
        <div>
            <div
                className={`flex gap-3 p-4 pr-8 ${first? 'rounded-t-md':''} border-2  border-${formData.payment.method=='Bank Transfer' ? 'greny' : 'secondary border-b-0' }`}>
                <div
                    onClick={handleClickPaymentChoice}
                    className="flex items-center gap-2 cursor-pointer w-full" >
                        <input
                        className={styles.payment_checkbox}
                        checked={formData.payment.method === 'Bank Transfer'}
                        type="radio"
                        name="payment"
                        value="Bank Transfer"
                        readOnly/>
                    <span>{t('checkout_bank_transfer')}</span>
                </div>
            </div>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                    }}
                    transition={{
                    duration: 0.3,
                    ease: "easeOut"
                    }}
                    className="overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{
                    opacity: isOpen ? 1 : 0
                    }}
                    transition={{
                    duration: 0.2,
                    delay: isOpen ? 0 : 0.5 // Delay opacity animation when closing
                    }}
                    ref={contentRef}
                    className='space-y-2 bg-[#19363c] border-r-2 border-l-2 border-secondary p-4'>
                    <p>{t('checkout_bank_transfer_instructions', { whatsappNumber: storeConfig.whatsappNumber })}</p>
                </motion.div>
            </motion.div>
        </div>
    )
}
