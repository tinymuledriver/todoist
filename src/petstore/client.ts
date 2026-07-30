/**
 * Typed Petstore API client.
 * Generated from: https://petstore3.swagger.io/api/v3/openapi.json
 *
 * Usage:
 *   import { PetstoreClient } from './petstore';
 *   const client = new PetstoreClient({ apiKey: 'my-key' });
 *   const pet = await client.getPetById(1);
 */

import type {
  Pet,
  PetStatus,
  Order,
  User,
  ApiResponse,
  Inventory,
} from './types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface PetstoreClientConfig {
  /** Base URL of the Petstore API. Defaults to the official demo server. */
  baseUrl?: string;
  /** Value sent as the `api_key` header for secured endpoints. */
  apiKey?: string;
  /** OAuth2 bearer token for `petstore_auth` secured endpoints. */
  accessToken?: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  path: string;
  query?: Record<string, string | string[] | number | boolean | undefined>;
  body?: unknown;
}

function buildQuery(
  params: Record<string, string | string[] | number | boolean | undefined>,
): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class PetstoreClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly accessToken: string | undefined;

  constructor(config: PetstoreClientConfig = {}) {
    this.baseUrl = (config.baseUrl ?? 'https://petstore3.swagger.io/api/v3').replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.accessToken = config.accessToken;
  }

  // -------------------------------------------------------------------------
  // Internal fetch wrapper
  // -------------------------------------------------------------------------

  private async request<T>(opts: RequestOptions): Promise<T> {
    const { method = 'GET', path, query, body } = opts;

    const qs = query ? buildQuery(query) : '';
    const url = `${this.baseUrl}${path}${qs}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.apiKey) headers['api_key'] = this.apiKey;
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Petstore API error ${response.status}: ${response.statusText} (${method} ${path})`);
    }

    // Some endpoints return 200 with no body (e.g. logout)
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
  }

  // -------------------------------------------------------------------------
  // Pet endpoints
  // -------------------------------------------------------------------------

  /** PUT /pet — Update an existing pet */
  updatePet(pet: Pet): Promise<Pet> {
    return this.request<Pet>({ method: 'PUT', path: '/pet', body: pet });
  }

  /** POST /pet — Add a new pet to the store */
  addPet(pet: Pet): Promise<Pet> {
    return this.request<Pet>({ method: 'POST', path: '/pet', body: pet });
  }

  /** GET /pet/findByStatus — Finds pets by status */
  findPetsByStatus(status?: PetStatus): Promise<Pet[]> {
    return this.request<Pet[]>({
      path: '/pet/findByStatus',
      query: { status },
    });
  }

  /** GET /pet/findByTags — Finds pets by tags */
  findPetsByTags(tags?: string[]): Promise<Pet[]> {
    return this.request<Pet[]>({
      path: '/pet/findByTags',
      query: tags ? { tags } : undefined,
    });
  }

  /** GET /pet/{petId} — Find pet by ID */
  getPetById(petId: number): Promise<Pet> {
    return this.request<Pet>({ path: `/pet/${petId}` });
  }

  /** POST /pet/{petId} — Updates a pet in the store with form data */
  updatePetWithForm(petId: number, params?: { name?: string; status?: string }): Promise<void> {
    return this.request<void>({
      method: 'POST',
      path: `/pet/${petId}`,
      query: params,
    });
  }

  /** DELETE /pet/{petId} — Deletes a pet */
  deletePet(petId: number): Promise<void> {
    return this.request<void>({ method: 'DELETE', path: `/pet/${petId}` });
  }

  /** POST /pet/{petId}/uploadImage — Uploads an image */
  uploadFile(petId: number, image: Blob, additionalMetadata?: string): Promise<ApiResponse> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.apiKey) headers['api_key'] = this.apiKey;
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`;

    const qs = additionalMetadata
      ? `?additionalMetadata=${encodeURIComponent(additionalMetadata)}`
      : '';

    return fetch(`${this.baseUrl}/pet/${petId}/uploadImage${qs}`, {
      method: 'POST',
      headers,
      body: image,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Petstore API error ${res.status}: ${res.statusText}`);
      return res.json() as Promise<ApiResponse>;
    });
  }

  // -------------------------------------------------------------------------
  // Store endpoints
  // -------------------------------------------------------------------------

  /** GET /store/inventory — Returns pet inventories by status */
  getInventory(): Promise<Inventory> {
    return this.request<Inventory>({ path: '/store/inventory' });
  }

  /** POST /store/order — Place an order for a pet */
  placeOrder(order: Order): Promise<Order> {
    return this.request<Order>({ method: 'POST', path: '/store/order', body: order });
  }

  /** GET /store/order/{orderId} — Find purchase order by ID */
  getOrderById(orderId: number): Promise<Order> {
    return this.request<Order>({ path: `/store/order/${orderId}` });
  }

  /** DELETE /store/order/{orderId} — Delete purchase order by ID */
  deleteOrder(orderId: number): Promise<void> {
    return this.request<void>({ method: 'DELETE', path: `/store/order/${orderId}` });
  }

  // -------------------------------------------------------------------------
  // User endpoints
  // -------------------------------------------------------------------------

  /** POST /user — Create user */
  createUser(user: User): Promise<User> {
    return this.request<User>({ method: 'POST', path: '/user', body: user });
  }

  /** POST /user/createWithList — Creates list of users with given input array */
  createUsersWithListInput(users: User[]): Promise<User> {
    return this.request<User>({ method: 'POST', path: '/user/createWithList', body: users });
  }

  /** GET /user/login — Logs user into the system */
  loginUser(username?: string, password?: string): Promise<string> {
    return this.request<string>({
      path: '/user/login',
      query: { username, password },
    });
  }

  /** GET /user/logout — Logs out current logged in user session */
  logoutUser(): Promise<void> {
    return this.request<void>({ path: '/user/logout' });
  }

  /** GET /user/{username} — Get user by user name */
  getUserByName(username: string): Promise<User> {
    return this.request<User>({ path: `/user/${encodeURIComponent(username)}` });
  }

  /** PUT /user/{username} — Update user */
  updateUser(username: string, user: User): Promise<void> {
    return this.request<void>({
      method: 'PUT',
      path: `/user/${encodeURIComponent(username)}`,
      body: user,
    });
  }

  /** DELETE /user/{username} — Delete user */
  deleteUser(username: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      path: `/user/${encodeURIComponent(username)}`,
    });
  }
}
