/**
 * Types generated from the Petstore OpenAPI 3.0 spec.
 * Source: https://petstore3.swagger.io/api/v3/openapi.json
 */

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export interface Category {
  id?: number;
  name?: string;
}

export interface Tag {
  id?: number;
  name?: string;
}

export type PetStatus = 'available' | 'pending' | 'sold';

export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  /** pet status in the store */
  status?: PetStatus;
}

export type OrderStatus = 'placed' | 'approved' | 'delivered';

export interface Order {
  id?: number;
  petId?: number;
  quantity?: number;
  shipDate?: string;
  /** Order Status */
  status?: OrderStatus;
  complete?: boolean;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Customer {
  id?: number;
  username?: string;
  address?: Address[];
}

export interface User {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  /** User Status */
  userStatus?: number;
}

export interface ApiResponse {
  code?: number;
  type?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Request / Response helpers
// ---------------------------------------------------------------------------

/** Map returned by GET /store/inventory: status → count */
export type Inventory = Record<string, number>;
