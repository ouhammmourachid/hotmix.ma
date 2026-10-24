import Product from '@/types/product';

// The product page already has the full product, so "Buy now" hands it to the checkout
// through sessionStorage. The checkout can then render instantly (also after a reload in
// the same tab) and refresh it from the API in the background.
const STORAGE_KEY = 'buy-now-product';

export function saveBuyNowProduct(product: Product) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(product));
  } catch {
    // Storage full or blocked (private mode): checkout just loads it from the API
  }
}

export function readBuyNowProduct(productId: string): Product | null {
  try {
    const product = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    return product && String(product.id) === productId ? product : null;
  } catch {
    return null;
  }
}
