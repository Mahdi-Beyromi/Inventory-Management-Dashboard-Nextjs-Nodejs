export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUSES.PENDING]: "Pending",
  [ORDER_STATUSES.CONFIRMED]: "Confirmed",
  [ORDER_STATUSES.SHIPPED]: "Shipped",
  [ORDER_STATUSES.DELIVERED]: "Delivered",
  [ORDER_STATUSES.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [ORDER_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
  [ORDER_STATUSES.CONFIRMED]: "bg-blue-100 text-blue-800",
  [ORDER_STATUSES.SHIPPED]: "bg-purple-100 text-purple-800",
  [ORDER_STATUSES.DELIVERED]: "bg-green-100 text-green-800",
  [ORDER_STATUSES.CANCELLED]: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  [ORDER_STATUSES.PENDING]: "⏳",
  [ORDER_STATUSES.CONFIRMED]: "✅",
  [ORDER_STATUSES.SHIPPED]: "📦",
  [ORDER_STATUSES.DELIVERED]: "🎉",
  [ORDER_STATUSES.CANCELLED]: "❌",
};

export const getStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status;
};

export const getStatusColor = (status: string): string => {
  return ORDER_STATUS_COLORS[status as OrderStatus] || "bg-gray-100 text-gray-800";
};

export const getStatusIcon = (status: string): string => {
  return ORDER_STATUS_ICONS[status as OrderStatus] || "❓";
};
