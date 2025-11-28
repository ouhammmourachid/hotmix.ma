import User from './user'
import Product from './product'
export default interface Review {
    id: number
    customer: User
    product: Product|number
    rating: number
    comment: string
    created_at: string
    updated_at?: string
    display: boolean
}
