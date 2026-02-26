import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MedicineCategory, OrderStatus, PaymentMethod, type Product, type OrderView, type UserProfileView, type BlogPost, type Address, type OrderItem, ExternalBlob } from '../backend';

// ─── Products ───────────────────────────────────────────────────────────────

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: MedicineCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetProduct(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchProducts(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'search', keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      return actor.searchProducts(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; description: string; price: number;
      category: MedicineCategory; requiresPrescription: boolean;
      stockStatus: boolean; imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(data.name, data.description, data.price, data.category, data.requiresPrescription, data.stockStatus, data.imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string; name: string; description: string; price: number;
      category: MedicineCategory; requiresPrescription: boolean;
      stockStatus: boolean; imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(data.id, data.name, data.description, data.price, data.category, data.requiresPrescription, data.stockStatus, data.imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<OrderView[]>({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrder(orderId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<OrderView | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor || !orderId) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      items: OrderItem[];
      deliveryAddress: string;
      paymentMethod: PaymentMethod;
      prescription: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(data.items, data.deliveryAddress, data.paymentMethod, data.prescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(data.orderId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
}

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfileView | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; phoneNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(data.name, data.email, data.phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Address) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { oldAddress: Address; newAddress: Address }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAddress(data.oldAddress, data.newAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useDeleteAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Address) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export function useGetPublishedBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ['blogs', 'published'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ['blogs', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(blogId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost | null>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!actor || !blogId) return null;
      return actor.getBlogPost(blogId);
    },
    enabled: !!actor && !isFetching && !!blogId,
  });
}

export function useGetBlogPostsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ['blogs', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getBlogPostsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string; content: string; category: string;
      author: string; coverImageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(data.title, data.content, data.category, data.author, data.coverImageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      blogId: string; title: string; content: string;
      category: string; author: string; coverImageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(data.blogId, data.title, data.content, data.category, data.author, data.coverImageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blogId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function usePublishBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blogId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishBlogPost(blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function useUnpublishBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blogId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unpublishBlogPost(blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetAllOrdersAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<OrderView[]>({
    queryKey: ['orders', 'admin'],
    queryFn: async () => {
      if (!actor) return [];
      // Admin uses getUserOrders but we need all orders - using a workaround
      // The backend doesn't have a getAllOrders endpoint, so we use getUserOrders
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching,
  });
}
