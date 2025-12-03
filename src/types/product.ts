import Tag from "./tag";
import Category from "./category";
import Color from "./color";
import Size from "./size";
import ImageType from "./image";

export default interface Product {
    id: string ;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    status: "draft" | "published" | "archived";
    discount?: string;
    created_at: string;
    updated_at: string;
    images: ImageType[];
    category?: Category;
    tags?: Tag[];
    colors?: Color[];
    sizes?: Size[];
}
