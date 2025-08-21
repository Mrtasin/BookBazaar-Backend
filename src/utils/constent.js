export const UserRoleEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};
export const ArrayUserRole = Object.values(UserRoleEnum);

export const ratingEnum = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};
export const ArrayRating = Object.values(ratingEnum);

export const orderStatus = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ArrayOrderStatus = Object.values(orderStatus);
