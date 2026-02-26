import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BlogPost {
    id: string;
    status: boolean;
    coverImageUrl: string;
    title: string;
    content: string;
    createdAt: Time;
    author: string;
    category: string;
}
export interface Address {
    city: string;
    addressLabel: string;
    address: string;
    pincode: bigint;
}
export type Time = bigint;
export interface OrderItem {
    productId: string;
    quantity: bigint;
}
export interface UserProfileView {
    name: string;
    email: string;
    addresses: Array<Address>;
    phoneNumber: string;
}
export interface Product {
    id: string;
    stockStatus: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: MedicineCategory;
    requiresPrescription: boolean;
    price: number;
}
export interface OrderView {
    id: string;
    status: OrderStatus;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
    prescription?: ExternalBlob;
    totalAmount: number;
    timestamp: Time;
    customerId: Principal;
    items: Array<OrderItem>;
}
export enum MedicineCategory {
    osteoporosis = "osteoporosis",
    antiFungal = "antiFungal",
    antiViral = "antiViral",
    vaccine = "vaccine",
    otcProducts = "otcProducts",
    hepatitis = "hepatitis",
    diabetesCare = "diabetesCare",
    surgicalDevices = "surgicalDevices",
    transplant = "transplant",
    weightLoss = "weightLoss",
    antiCancer = "antiCancer",
    nephrology = "nephrology",
    general = "general",
    infertility = "infertility",
    arthritis = "arthritis",
    heartDisease = "heartDisease",
    skinDisease = "skinDisease",
    bloodDisorders = "bloodDisorders",
    hivAids = "hivAids",
    cardiacCare = "cardiacCare"
}
export enum OrderStatus {
    verified = "verified",
    outForDelivery = "outForDelivery",
    delivered = "delivered",
    received = "received",
    packed = "packed"
}
export enum PaymentMethod {
    cod = "cod",
    upi = "upi",
    card = "card"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAddress(address: Address): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, category: string, author: string, coverImageUrl: string): Promise<string>;
    createProduct(name: string, description: string, price: number, category: MedicineCategory, requiresPrescription: boolean, stockStatus: boolean, imageUrl: string): Promise<string>;
    deleteAddress(address: Address): Promise<void>;
    deleteBlogPost(blogId: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllProducts(): Promise<Array<Product>>;
    getBlogPost(blogId: string): Promise<BlogPost | null>;
    getBlogPostsByCategory(category: string): Promise<Array<BlogPost>>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryIndex(): Promise<Array<[MedicineCategory, Array<string>]>>;
    getOrder(orderId: string): Promise<OrderView | null>;
    getProduct(id: string): Promise<Product | null>;
    getProductsByCategory(category: MedicineCategory): Promise<Array<Product>>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getUserOrders(): Promise<Array<OrderView>>;
    getUserProfile(): Promise<UserProfileView>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<OrderItem>, deliveryAddress: string, paymentMethod: PaymentMethod, prescription: ExternalBlob | null): Promise<string>;
    publishBlogPost(blogId: string): Promise<void>;
    saveCallerUserProfile(name: string, email: string, phoneNumber: string): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    unpublishBlogPost(blogId: string): Promise<void>;
    updateAddress(oldAddress: Address, newAddress: Address): Promise<void>;
    updateBlogPost(blogId: string, title: string, content: string, category: string, author: string, coverImageUrl: string): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(id: string, name: string, description: string, price: number, category: MedicineCategory, requiresPrescription: boolean, stockStatus: boolean, imageUrl: string): Promise<void>;
}
