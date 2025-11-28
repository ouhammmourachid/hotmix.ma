import Product from './product'
import Color from './color'
import Size from './size'

export default interface Item{
    id: number
    product: Product
    quantity: number
    price: number
    color?: Color
    size?: Size
}
