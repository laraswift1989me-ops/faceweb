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

function getAuthHeaders(): HeadersInit {
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
  const headers = requiresAuth ? getAuthHeaders() : API_CONFIG.HEADERS;

  const config: RequestInit = { method, headers };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const text = await response.text();

    if (response.status === 401 && !endpoint.includes("/api/register") && !endpoint.includes("/api/login")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("swiftearn_user");
      // Use window.location only if not in a router transition or if necessary
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
         window.location.href = "/login";
      }
      throw new Error("Session expired");
    }

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
        message: responseData.message || responseData.error || "API request failed",
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

export interface UserData {
  id: number;
  name?: string;
  email: string;
  level: number;
  trc20_address: string;
  referral_code?: string;
  kyc_status?: string;
  kyc_doc?: string;
  kyc_selfie?: string;
  kyc_attempts?: number;
  is_kyc_verified?: boolean;
  wallet_balance?: string;
  staked_balance?: string;
  mining_booster?: number;
  cached_referral_count?: number;
  daily_task_streak?: number;
  last_full_task_completion_date?: string | null;
  account_score?: number;
  last_harvested_at?: string | null;
  total_referrals?: number;
  active_referrals?: number;
  last_milestone_unlocked?: number;
  parent_id?: number | null;
  referrer_id?: number | null;
  wallet?: {
    id: number;
    available_balance: number | string;
    locked_balance: number | string;
    freezed_balance: number | string;
  };
}

export const authApi = {
  // Step 1: Send OTP
  async sendOtp(data: any): Promise<{ message: string }> {
    return apiRequest("/api/register/send-otp", "POST", data);
  },
  // Step 2: Verify OTP
  async verifyOtp(data: any): Promise<{ access_token: string; user: UserData }> {
    return apiRequest("/api/register/verify", "POST", data);
  },
  async login(data: any): Promise<{ access_token: string; user: UserData }> {
    return apiRequest("/api/login", "POST", data);
  },
  async logout(): Promise<void> {
    return apiRequest("/api/logout", "POST", null, true);
  },
  async getProfile(): Promise<UserData> {
    return apiRequest("/api/user/me", "GET", null, true);
  },
  async changePassword(data: { current_password: string; password: string; password_confirmation: string }): Promise<{ message: string }> {
    return apiRequest("/api/change-password", "POST", data, true);
  },
  async forgotPassword(data: { email: string }): Promise<{ message: string }> {
    return apiRequest("/api/forgot-password", "POST", data);
  },
  async resetPassword(data: { email: string; otp: string; password: string; password_confirmation: string }): Promise<{ message: string }> {
    return apiRequest("/api/reset-password", "POST", data);
  },
};

// ============================================
// PLATFORM SETTINGS API (public, no auth)
// ============================================

export interface PlatformSettings {
  min_withdrawal: string;
  withdrawal_fee: string;
  auto_approve_limit: string;
  min_deposit: string;
  min_stake: string;
  lock_period_days: string;
  unfreeze_min_level: string;
  [key: string]: string;
}

export const platformApi = {
  async getSettings(): Promise<PlatformSettings> {
    return apiRequest("/api/platform-settings", "GET");
  },
};

// ============================================
// DASHBOARD & FINANCE APIs
// ============================================

export interface FinanceStats {
  total_earned: string;
  active_investments: string;
  referral_bonus_total: string;
}

export interface LeaderboardUser {
  name: string;
  level: number;
  total_earned: string;
}

export const financeApi = {
  async getStats(): Promise<FinanceStats> {
    return apiRequest("/api/finance/stats", "GET", null, true);
  },
  async getLeaderboard(): Promise<LeaderboardUser[]> {
    return apiRequest("/api/finance/leaderboard", "GET", null, true);
  },
};

// ============================================
// WALLET APIs
// ============================================

export interface WalletData {
  available_balance: string | number;
  locked_balance: string | number;
  freezed_balance: string | number;
  trc20_address?: string;
}

export interface LockedScheduleData {
  schedule: Array<{ date: string; amount: number; count: number; is_past: boolean }>;
  next_unlock: { date: string; amount: number } | null;
  total_locked: number;
}

export const walletApi = {
  async getWallet(): Promise<WalletData> {
    return apiRequest("/api/wallet", "GET", null, true);
  },
  async withdraw(data: { amount: number; wallet_address: string }): Promise<any> {
    return apiRequest("/api/withdrawals", "POST", data, true);
  },
  async requestWithdrawal(data: { amount: number; wallet_address: string }): Promise<any> {
    return apiRequest("/api/withdrawals", "POST", data, true);
  },
  async unfreeze(data: { amount: number }): Promise<any> {
    return apiRequest("/api/unfreeze", "POST", data, true);
  },
  async getLockedSchedule(): Promise<LockedScheduleData> {
    return apiRequest("/api/wallet/locked-schedule", "GET", null, true);
  },
};

// ============================================
// STAKING APIs
// ============================================

export interface StakeProject {
  id: number;
  name: string;
  daily_roi: string;
  daily_roi_percent?: string; // Alternative field name some APIs might use
  unlock_level: number;
  is_unlocked: boolean;
  min_stake?: number;
  lock_duration_days?: number;
}

export const stakeApi = {
  async getProjects(): Promise<StakeProject[]> {
    return apiRequest("/api/stake/projects", "GET", null, true);
  },
  async createStake(data: { project_id: number; amount: number }): Promise<any> {
    return apiRequest("/api/stake", "POST", data, true);
  },
  async harvest(stakeId: number): Promise<{ message: string }> {
    return apiRequest(`/api/stake/${stakeId}/harvest`, "POST", null, true);
  },
  async getMyStakes(): Promise<any[]> {
    return apiRequest("/api/stake/my-stakes", "GET", null, true);
  },
};

// ============================================
// REFERRAL APIs
// ============================================

export interface ReferralTierData {
  total: number;
  active: number;
  inactive: number;
  earnings: number;
  commission_amount: number;
  commission_type: 'available' | 'locked';
}

export interface ReferralData {
  overview: {
    total_team: number;
    total_active: number;
    active_direct: number;
    total_earned: number;
  };
  tiers: {
    tier_1: ReferralTierData;
    tier_2: ReferralTierData;
    tier_3: ReferralTierData;
  };
  recent_referrals: Array<{
    name: string;
    joined_at: string;
    kyc: boolean;
    is_active: boolean;
  }>;
}

export const referralApi = {
  async getReferrals(): Promise<ReferralData> {
    return apiRequest("/api/referrals", "GET", null, true);
  },
};

// ============================================
// LEVEL-UP APIs
// ============================================

export const levelUpApi = {
  async getEligibility(): Promise<any> {
    return apiRequest("/api/level-up/eligibility", "GET", null, true);
  },
  async levelUp(): Promise<{ success: boolean; message: string; unlocked: number; new_level: number }> {
    return apiRequest("/api/level-up", "POST", null, true);
  },
};

// ============================================
// TASKS APIs
// ============================================

export const taskApi = {
  async getTasks(): Promise<any> {
    return apiRequest("/api/tasks", "GET", null, true);
  },
  async completeTask(taskId: number): Promise<any> {
    return apiRequest(`/api/tasks/${taskId}/complete`, "POST", null, true);
  },
  async claimStreakBonus(): Promise<any> {
    return apiRequest("/api/tasks/streak-bonus/claim", "POST", null, true);
  },
  async claimMilestoneBonus(): Promise<any> {
    return apiRequest("/api/tasks/milestone-bonus/claim", "POST", null, true);
  },
};

// ============================================
// NOTIFICATIONS APIs
// ============================================

export const notificationApi = {
  async getNotifications(): Promise<any[]> {
    return apiRequest("/api/notifications", "GET", null, true);
  },
  async markRead(): Promise<void> {
    return apiRequest("/api/notifications/read-all", "POST", null, true);
  },
};

// ============================================
// TRANSACTIONS APIs
// ============================================

export const transactionApi = {
  async getTransactions(): Promise<any[]> {
    return apiRequest("/api/transactions", "GET", null, true);
  },
};

// ============================================
// SUPPORT TICKET APIs
// ============================================

async function apiRequestMultipart<T = any>(
  endpoint: string,
  method: string,
  formData: FormData,
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { method, headers, body: formData });
    const text = await response.text();

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("swiftearn_user");
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }

    let responseData: any = {};
    if (text) {
      try { responseData = JSON.parse(text); } catch { throw { status: response.status, message: "Invalid response from server" }; }
    }

    if (!response.ok) {
      throw { status: response.status, message: responseData.message || "Request failed", errors: responseData.errors || null };
    }
    return responseData as T;
  } catch (error: any) {
    if (error.status !== undefined) throw error;
    throw { status: 0, message: error.message || "Network error.", errors: null };
  }
}

export const supportApi = {
  async getTickets(): Promise<any> {
    return apiRequest("/api/support-tickets", "GET", null, true);
  },
  async getTicket(id: number): Promise<any> {
    return apiRequest(`/api/support-tickets/${id}`, "GET", null, true);
  },
  async createTicket(formData: FormData): Promise<any> {
    return apiRequestMultipart("/api/support-tickets", "POST", formData);
  },
  async reply(id: number, formData: FormData): Promise<any> {
    return apiRequestMultipart(`/api/support-tickets/${id}/replies`, "POST", formData);
  },
};