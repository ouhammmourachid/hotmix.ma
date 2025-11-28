import Product from './product'
import Color from './color'
import SizeType from './size'

export default interface CartItem{
    id: number
    product: Product
    quantity: number
    price: number
    color?: Color
    size?: SizeType
}
