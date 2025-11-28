import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { HoverInfo,CustomInput } from '@/components/small-pieces';
import styles from '@/styles/payment.module.css';

export default function CollapsibleCreditCard({
                                                    formData,
                                                    setFormData,
                                                    isOpen,
                                                    first=false
                                                }:{
                                                    formData:any,
                                                    setFormData:any,
                                                    isOpen:boolean
                                                    first?:boolean
                                                }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const handleClickPaymentChoice = (e:any) => {
        setFormData({...formData, paymentType: "credit"});
    }
    return (
        <div>
            <div
                className={`flex gap-3 p-4 pr-8 ${first? 'rounded-t-md':''} border-2  border-${formData.paymentType=='credit' ? 'greny' : 'secondary border-b-0' }`}>
                <div
                    onClick={handleClickPaymentChoice}
                    className="flex items-center gap-2 cursor-pointer w-full" >
                    <input
                    className={styles.payment_checkbox}
                    checked={formData.paymentType === 'credit'}
                    type="radio"
                    name="payment"
                    value="credit"
                    readOnly/>
                    <span>Credit card</span>
                </div>
                <div className="ml-auto flex gap-2">
                    <img src="/visa.png" alt="Visa" className="h-5" />
                    <img src="/mastercard.png" alt="Mastercard" className="h-5" />
                    <img src="/cmi.png" alt="CMI" className="w-8 h-[18px] bg-white py-0.5" />
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
                    <CustomInput
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                        type="text">
                        <Lock size={18}/>
                    </CustomInput>
                    <div className="grid grid-cols-2 gap-4">
                        <CustomInput
                            placeholder="Expiration date (MM / YY)"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                            type="text"/>
                        <CustomInput
                            placeholder="Security code (CCV)"
                            value={formData.cvv}
                            onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                            type="text">
                        <HoverInfo message='3-digit security code usually found on the back of your
                            card. American Express cards have a 4-digit code located on the front.'/>
                        </CustomInput>
                    </div>
                    <CustomInput
                        placeholder="Name on card"
                        value={formData.nameOnCard}
                        onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})}
                        type="text"/>
                </motion.div>
            </motion.div>
        </div>
    )
}
