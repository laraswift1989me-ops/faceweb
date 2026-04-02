import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { authApi, financeApi, walletApi, stakeApi, referralApi, taskApi, notificationApi, transactionApi, UserData, WalletData, FinanceStats, StakeProject } from "../services/api";

const STALE_MS = 30_000; // Don't re-fetch data less than 30s old

interface AppContextType {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  token: string | null;
  user: UserData | null;
  wallet: WalletData | null;
  stats: FinanceStats | null;
  leaderboard: any[];
  stakeProjects: StakeProject[];
  userStakes: any[];
  referralData: any | null;
  notifications: any[];
  unreadCount: number;
  transactions: any[];
  tasks: any[];
  streakProgress: any | null;
  levelProgress: any | null;

  // Actions
  login: (data: any) => Promise<void>;
  registerSendOtp: (data: any) => Promise<{ message: string }>;
  registerVerifyOtp: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  harvest: (projectId: number) => Promise<string>;
  stake: (projectId: number, amount: number) => Promise<void>;
  withdraw: (amount: number, wallet_address: string) => Promise<void>;
  unfreeze: (amount: number) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stakeProjects, setStakeProjects] = useState<StakeProject[]>([]);
  const [userStakes, setUserStakes] = useState<any[]>([]);
  const [referralData, setReferralData] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [streakProgress, setStreakProgress] = useState<any | null>(null);
  const [levelProgress, setLevelProgress] = useState<any | null>(null);

  const lastRefreshedAt = useRef<number | null>(null);
  const isRefreshing = useRef(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const savedToken = localStorage.getItem("access_token");
    const savedUserStr = localStorage.getItem("swiftearn_user");

    if (savedToken && savedUserStr) {
      setToken(savedToken);
      setUser(JSON.parse(savedUserStr));
      setIsAuthenticated(true);
      await refreshAll();
    }
    setIsBootstrapping(false);
  }

  async function refreshAll() {
    if (!localStorage.getItem("access_token")) return;

    // Prevent concurrent fetches
    if (isRefreshing.current) return;

    // Skip if data is fresh enough (except on first load when lastRefreshedAt is null)
    const now = Date.now();
    if (lastRefreshedAt.current !== null && now - lastRefreshedAt.current < STALE_MS) return;

    isRefreshing.current = true;
    try {
      const [walletRes, profileRes, statsRes, leaderboardRes, projectsRes, stakesRes, referralsRes, notifsRes, txRes, tasksRes] = await Promise.all([
        walletApi.getWallet().catch(() => null),
        authApi.getProfile().catch(() => null),
        financeApi.getStats().catch(() => null),
        financeApi.getLeaderboard().catch(() => []),
        stakeApi.getProjects().catch(() => []),
        stakeApi.getMyStakes().catch(() => []),
        referralApi.getReferrals().catch(() => null),
        notificationApi.getNotifications().catch(() => []),
        transactionApi.getTransactions().catch(() => []),
        taskApi.getTasks().catch(() => []),
      ]);

      if (profileRes) {
        setUser(profileRes);
        localStorage.setItem("swiftearn_user", JSON.stringify(profileRes));
      }
      if (walletRes) {
        const trc20 = profileRes?.trc20_address ?? JSON.parse(localStorage.getItem("swiftearn_user") || "{}").trc20_address;
        setWallet({ ...walletRes, trc20_address: trc20 });
      }
      if (statsRes) setStats(statsRes);
      if (leaderboardRes) setLeaderboard(leaderboardRes);
      if (projectsRes) setStakeProjects(projectsRes);
      if (stakesRes) setUserStakes(stakesRes);
      if (referralsRes) setReferralData(referralsRes);
      if (notifsRes) {
        setNotifications(notifsRes);
        setUnreadCount(notifsRes.filter((n: any) => !n.is_read).length);
      }
      if (txRes) setTransactions(txRes);
      if (tasksRes) {
        setTasks(Array.isArray(tasksRes) ? tasksRes : (tasksRes.tasks ?? []));
        if (tasksRes.streak_progress) setStreakProgress(tasksRes.streak_progress);
        if (tasksRes.level_progress)  setLevelProgress(tasksRes.level_progress);
      }

      lastRefreshedAt.current = Date.now();
    } catch (error) {
      console.error("RefreshAll failed:", error);
    } finally {
      isRefreshing.current = false;
    }
  }

  // --- Targeted partial refresh helpers (avoid hammering all 10 APIs after every action) ---

  async function refreshWallet() {
    const [walletRes, profileRes] = await Promise.all([
      walletApi.getWallet().catch(() => null),
      authApi.getProfile().catch(() => null),
    ]);
    if (profileRes) {
      setUser(profileRes);
      localStorage.setItem("swiftearn_user", JSON.stringify(profileRes));
    }
    if (walletRes) {
      const trc20 = profileRes?.trc20_address ?? JSON.parse(localStorage.getItem("swiftearn_user") || "{}").trc20_address;
      setWallet({ ...walletRes, trc20_address: trc20 });
    }
    lastRefreshedAt.current = null; // Mark stale so next refreshAll runs fresh
  }

  async function refreshStakes() {
    const [stakesRes, statsRes] = await Promise.all([
      stakeApi.getMyStakes().catch(() => null),
      financeApi.getStats().catch(() => null),
    ]);
    if (stakesRes) setUserStakes(stakesRes);
    if (statsRes) setStats(statsRes);
    lastRefreshedAt.current = null;
  }

  async function refreshNotifications() {
    const notifsRes = await notificationApi.getNotifications().catch(() => null);
    if (notifsRes) {
      setNotifications(notifsRes);
      setUnreadCount(notifsRes.filter((n: any) => !n.is_read).length);
    }
  }

  async function refreshTasks() {
    const tasksRes = await taskApi.getTasks().catch(() => null);
    if (tasksRes) {
      setTasks(Array.isArray(tasksRes) ? tasksRes : (tasksRes.tasks ?? []));
      if (tasksRes.streak_progress) setStreakProgress(tasksRes.streak_progress);
      if (tasksRes.level_progress)  setLevelProgress(tasksRes.level_progress);
    }
    lastRefreshedAt.current = null;
  }

  // --- Public actions ---

  async function login(data: any) {
    const res = await authApi.login(data);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("swiftearn_user", JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    setIsAuthenticated(true);
    lastRefreshedAt.current = null;
    await refreshAll();
  }

  async function registerSendOtp(data: any) {
    return await authApi.sendOtp(data);
  }

  async function registerVerifyOtp(data: any) {
    const res = await authApi.verifyOtp(data);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("swiftearn_user", JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    setIsAuthenticated(true);
    lastRefreshedAt.current = null;
    await refreshAll();
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("swiftearn_user");
      lastRefreshedAt.current = null;
      isRefreshing.current = false;
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setWallet(null);
      setStats(null);
      setLeaderboard([]);
      setStakeProjects([]);
      setUserStakes([]);
      setReferralData(null);
      setNotifications([]);
      setTransactions([]);
      setTasks([]);
      setStreakProgress(null);
      setLevelProgress(null);
      setUnreadCount(0);
    }
  }

  async function refreshUser() {
    const profileRes = await authApi.getProfile().catch(() => null);
    if (profileRes) {
      setUser(profileRes);
      localStorage.setItem("swiftearn_user", JSON.stringify(profileRes));
    }
  }

  async function harvest(stakeId: number) {
    const res = await stakeApi.harvest(stakeId);
    // Only need to re-fetch wallet balances and stake list
    await Promise.all([refreshWallet(), refreshStakes()]);
    return res.message;
  }

  async function stake(projectId: number, amount: number) {
    await stakeApi.createStake({ project_id: projectId, amount });
    await Promise.all([refreshWallet(), refreshStakes()]);
  }

  async function withdraw(amount: number, wallet_address: string) {
    await walletApi.withdraw({ amount, wallet_address });
    await refreshWallet();
  }

  async function unfreeze(amount: number) {
    await walletApi.unfreeze({ amount });
    await refreshWallet();
  }

  async function completeTask(taskId: number) {
    await taskApi.completeTask(taskId);
    await Promise.all([refreshTasks(), refreshWallet()]);
  }

  async function markNotificationRead(_id: number) {
    await notificationApi.markRead();
    await refreshNotifications();
  }

  const value: AppContextType = {
    isAuthenticated,
    isBootstrapping,
    token,
    user,
    wallet,
    stats,
    leaderboard,
    stakeProjects,
    userStakes,
    referralData,
    notifications,
    unreadCount,
    transactions,
    tasks,
    streakProgress,
    levelProgress,
    login,
    registerSendOtp,
    registerVerifyOtp,
    logout,
    refreshAll,
    refreshUser,
    harvest,
    stake,
    withdraw,
    unfreeze,
    completeTask,
    markNotificationRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useApp must be used within an AppProvider");
  return context;
}
