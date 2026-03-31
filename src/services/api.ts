/**
 * SwiftEarn Main API Service
 */

export const API_CONFIG = {
  BASE_URL: "https://api.swiftearn.us",
  TIMEOUT: 30000,
  HEADERS: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export function updateBaseUrl(newUrl: string) {
  API_CONFIG.BASE_URL = newUrl;
}

function getAuthHeaders(): HeadersInit {
  // CRITICAL FIX: This must match the key used in AppContext.tsx
  const token = localStorage.getItem("access_token");
  if (token) {
    return {
      ...API_CONFIG.HEADERS,
      Authorization: `Bearer ${token}`,
    };
  }
  return API_CONFIG.HEADERS;
}

async function apiRequest<T = any>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  requiresAuth: boolean = false,
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers = requiresAuth
    ? getAuthHeaders()
    : API_CONFIG.HEADERS;

  const config: RequestInit = { method, headers };

  if (
    data &&
    (method === "POST" ||
      method === "PUT" ||
      method === "PATCH")
  ) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const text = await response.text(); // Read as text first for safety

    // Force logout on 401s (ignore login endpoint so errors show up)
    if (response.status === 401 && endpoint !== "/api/login") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("swiftearn_user");
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    // Safely parse JSON
    let responseData: any = {};
    if (text) {
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        throw {
          status: response.status,
          message: "Invalid response from server",
        };
      }
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message:
          responseData.message ||
          responseData.error ||
          "API request failed",
        errors: responseData.errors || null,
      };
    }

    return responseData as T;
  } catch (error: any) {
    if (error.status !== undefined) throw error;
    throw {
      status: 0,
      message: error.message || "Network error.",
      errors: null,
    };
  }
}
// ============================================
// AUTHENTICATION APIs
// ============================================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  referred_by?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserData;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  trc20_address: string;
  referral_code: string;
  parent_id: string | null;
  wallet_balance: string;
  staked_balance: string;
  total_earned: string;
  mining_booster: number;
  kyc_status: "unverified" | "pending" | "verified";
  cached_referral_count: number;
  created_at: string;
  updated_at: string;
}

export const authApi = {
  async register(data: RegisterData): Promise<UserData> {
    return apiRequest("/api/register", "POST", data);
  },
  async login(data: LoginData): Promise<AuthResponse> {
    const res = await apiRequest("/api/login", "POST", data);
    if (!res || !res.access_token)
      throw new Error("Invalid response from server");
    return res;
  },
  async logout(): Promise<void> {
    return apiRequest("/api/logout", "POST", null, true);
  },
  async getProfile(): Promise<UserData> {
    return apiRequest("/api/user/me", "GET", null, true);
  },
};

// ============================================
// WALLET APIs
// ============================================

export interface WalletData {
  available: number;
  locked: number;
  total: number;
}

export interface DepositData {
  id: number;
  user_id: number;
  amount: string;
  status: "pending" | "completed" | "failed";
  tx_hash: string;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalData {
  id: number;
  user_id: number;
  amount: string;
  address: string;
  status: "pending" | "processing" | "completed" | "failed";
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  amount: number;
  address: string;
  password?: string;
}

export const walletApi = {
  async getWallet(): Promise<WalletData> {
    return apiRequest("/api/wallet", "GET", null, true);
  },
  async getDeposits(
    limit: number = 10,
  ): Promise<{ deposits: DepositData[] }> {
    return apiRequest(
      `/api/deposits?limit=${limit}`,
      "GET",
      null,
      true,
    );
  },
  async getWithdrawals(
    limit: number = 10,
  ): Promise<{ withdrawals: WithdrawalData[] }> {
    return apiRequest(
      `/api/withdrawals?limit=${limit}`,
      "GET",
      null,
      true,
    );
  },
  async requestWithdrawal(
    data: WithdrawalRequest,
  ): Promise<WithdrawalData> {
    return apiRequest("/api/withdrawals", "POST", data, true);
  },
};

// ============================================
// STAKING APIs
// ============================================

export interface StakeProject {
  id: number;
  name: string;
  description: string;
  min_stake: string;
  daily_roi_percent: string;
  lock_duration_days: number;
  is_active: boolean;
}

export interface UserStake {
  id: number;
  project_name: string;
  amount: string;
  daily_roi: string;
  last_harvested_at: string;
  created_at: string;
}

export interface StakeRequest {
  project_id: number;
  amount: number;
}

export const stakeApi = {
  async getProjects(): Promise<StakeProject[]> {
    return apiRequest("/api/stake/projects", "GET", null, true);
  },
  async getUserStakes(): Promise<UserStake[]> {
    return apiRequest(
      "/api/stake/my-stakes",
      "GET",
      null,
      true,
    );
  },
  async createStake(data: StakeRequest): Promise<UserStake> {
    return apiRequest("/api/stake", "POST", data, true);
  },
  async harvestStake(
    stakeId?: number,
  ): Promise<{ amount: string; message: string }> {
    return apiRequest(
      `/api/stake/${stakeId || 0}/harvest`,
      "POST",
      null,
      true,
    );
  },
};

// ============================================
// REFERRAL APIs
// ============================================

export interface ReferralStats {
  overview: {
    total_team: number;
    total_earned: number;
  };
  tiers: any;
}

export const referralApi = {
  async getStats(): Promise<ReferralStats> {
    return apiRequest(
      "/api/referrals/stats",
      "GET",
      null,
      true,
    );
  },
  async getReferrals(): Promise<ReferralStats> {
    return apiRequest("/api/referrals", "GET", null, true);
  },
};

// ============================================
// TASKS APIs
// ============================================

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: string;
  type: "daily" | "weekly" | "special";
  status: "Start" | "Claimed";
  action_key?: string;
}

export const taskApi = {
  async getTasks(): Promise<any> {
    return apiRequest("/api/tasks", "GET", null, true);
  },
  async completeTask(data: {
    task_id: number;
  }): Promise<{ message: string; reward: string }> {
    return apiRequest(
      `/api/tasks/${data.task_id}/complete`,
      "POST",
      null,
      true,
    );
  },
};

// ============================================
// TRANSACTIONS APIs
// ============================================

export interface Transaction {
  id: number;
  user_id: number;
  type: string;
  amount: string;
  description: string;
  status: "pending" | "completed" | "cooling_down" | "failed";
  created_at: string;
  updated_at: string;
}

export const transactionApi = {
  async getTransactions(
    limit: number = 20,
    offset: number = 0,
  ): Promise<Transaction[]> {
    return apiRequest(
      `/api/transactions?limit=${limit}&offset=${offset}`,
      "GET",
      null,
      true,
    );
  },
  async getTransaction(
    id: number,
  ): Promise<{ transaction: Transaction }> {
    return apiRequest(
      `/api/transactions/${id}`,
      "GET",
      null,
      true,
    );
  },
};

// ============================================
// NOTIFICATIONS APIs
// ============================================

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  created_at: string;
}

export const notificationApi = {
  async getNotifications(
    limit: number = 20,
  ): Promise<Notification[]> {
    return apiRequest(
      `/api/notifications?limit=${limit}`,
      "GET",
      null,
      true,
    );
  },
  async markAsRead(id: number): Promise<void> {
    return apiRequest(
      `/api/notifications/${id}/read`,
      "POST",
      null,
      true,
    );
  },
  async markAllAsRead(): Promise<void> {
    return apiRequest(
      "/api/notifications/read-all",
      "POST",
      null,
      true,
    );
  },
};

export default {
  auth: authApi,
  wallet: walletApi,
  stake: stakeApi,
  referral: referralApi,
  task: taskApi,
  transaction: transactionApi,
  notification: notificationApi,
};