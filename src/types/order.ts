import Item from "./item"
import User from "./user"

export default interface Order {
    id: number
    created_at: string
    updated_at?: string
    total_price: number
    status: "placed" | "shipped" | "delivered" | "cancelled"
    shipping_address: string
    phone_number: string
    shipping_date?: string
    delevery_date?: string
    return_date?: string
    gift: boolean
    gift_message?: string
    customer: User
    items: Item[]
}
