import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, financeApi, walletApi, stakeApi, referralApi, taskApi, notificationApi, transactionApi, UserData, WalletData, FinanceStats, StakeProject } from "../services/api";

interface AppContextType {
  isAuthenticated: boolean;
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
      // Wait for initialization to complete before first refreshAll
      setTimeout(() => refreshAll(), 0);
    }
  }

  async function refreshAll() {
    if (!localStorage.getItem("access_token")) return;
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
        // trc20_address lives on the user, not the wallet endpoint — merge it in
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
      if (tasksRes) setTasks(Array.isArray(tasksRes) ? tasksRes : tasksRes.data ?? []);
    } catch (error) {
      console.error("RefreshAll failed:", error);
    }
  }

  async function login(data: any) {
    const res = await authApi.login(data);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("swiftearn_user", JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    setIsAuthenticated(true);
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
    await refreshAll();
    return res.message;
  }

  async function stake(projectId: number, amount: number) {
    await stakeApi.createStake({ project_id: projectId, amount });
    await refreshAll();
  }

  async function withdraw(amount: number, wallet_address: string) {
    await walletApi.withdraw({ amount, wallet_address });
    await refreshAll();
  }

  async function unfreeze(amount: number) {
    await walletApi.unfreeze({ amount });
    await refreshAll();
  }

  async function completeTask(taskId: number) {
    await taskApi.completeTask(taskId);
    await refreshAll();
  }

  async function markNotificationRead(_id: number) {
    await notificationApi.markRead();
    await refreshAll();
  }

  const value: AppContextType = {
    isAuthenticated,
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