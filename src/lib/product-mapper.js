// Shared by the client API service and server-side fetching, so both produce the same product shape

export const mapRecord = (record) => {
    const data = { ...record };
    if (record.expand) {
        Object.keys(record.expand).forEach(key => {
            data[key] = record.expand[key];
        });
    }
    return data;
};

export const mapProduct = (record) => {
    const data = mapRecord(record);

    // Map fields to match frontend expectations
    data.sale_price = data.salePrice;
    data.created_at = data.created;
    data.updated_at = data.updated;

    // Handle images - using direct S3 links
    if (data.images && Array.isArray(data.images)) {
        data.images = data.images.map((filename, index) => ({
            id: index,
            path: `https://hotmix-files.s3.eu-north-1.amazonaws.com/${record.collectionId}/${record.id}/${filename}`
        }));
    } else {
        data.images = [];
    }

    // Handle discount (ensure it's a string if needed, or keep as number if frontend handles it)
    // Based on types/product.ts, discount is string | undefined.
    if (data.discount !== undefined && data.discount !== null) {
        data.discount = String(data.discount);
    }

    return data;
};
