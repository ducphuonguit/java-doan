export interface User {
    id: number;
    username?: string | null;
    fullName?: string | null;
    email?: string | null;
    lineId?: string | null;
    role?: string | null;
    avatarUrl?: string | null;
    lastLoggingTime?: string | null;
    deliveries?: Delivery[];
    phoneNumber?: string | null;
    audit: AuditInfo
}

export interface Delivery {
    id: number;
    user?: User;
    recipientName: string;
    phoneNumber: string;
    city: City;
    district: District;
    address: string;
    notes?: string;
    audit: AuditInfo;
    isDefault?: boolean;
}

export interface City {
    code: string;
    name: string;
    districts?: District[];
}

export interface District {
    code: string;
    name: string;
    postalCode: string;
    city: City;
}

export interface ProductImage {
    id: string;
    url: string;
    product: Product;
}



export interface Product {
    id: number;
    name: string;
    description: string;
    variants?: ProductVariant[];
    audit: AuditInfo;
}


export type ProductBrief = Omit<Product, 'variants'>;

export interface AuditInfo {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface ProductVariant {
    id: number;
    variantName: string;
    quantityPerUnit: number;
    unitType: string;
    sku: Sku;
    product: ProductBrief;
}

export type ProductVariantBrief = Omit<ProductVariant, 'sku' | 'product'>;

export interface Sku {
    id: number;
    stockQuantity: number;
    price: number;
    variant?: ProductVariantBrief;
    product?: ProductBrief;
}

export interface ShippingAddress {
    id: number
    name: string
    phone: string
    address: string
    isDefault: boolean
}

export interface Order {
    id: number;
    user: User;
    orderItems: OrderItem[];
    totalAmount?: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    recipientName: string;
    phoneNumber: string;
    city: City;
    district: District;
    address: string;
    deliveryNotes?: string;
    notes?: string;
    audit: AuditInfo;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export interface OrderItem {
    id: number;
    productVariantId: number;
    productId: number;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface PaginationResult<T> {
    data: T[];
    pageInfo: PageInfo;
}

export interface PageInfo {
    next: number;
    totalCount: number;
    size: number;
}

export interface AbortSignalParams {
    abortSignal?: AbortSignal;
}

export interface PageableParams extends AbortSignalParams {
    q?: string;
    page: number;
    size: number;
    sort?: string;
}

export interface IntlString {
    en: string;
    zh: string
}

export interface AppError {
    code: string;
    message: IntlString
}

export interface OrderEntry {
    id: number,
    user: User,
    delivery: Delivery,
    quantity: number,
    sku: Sku,
    orderId: number,
    orderItemId: number,
    audit: AuditInfo,
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface PendingOrderEntriesWithUsersWithSkusResponse {
    orderEntries: OrderEntry[]
    users: User[]
    skus: Sku[]
}