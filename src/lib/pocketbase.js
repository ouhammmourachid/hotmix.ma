import PocketBase from 'pocketbase';

const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://admin.hotmix.ma';
const pb = new PocketBase(url);

export default pb;
