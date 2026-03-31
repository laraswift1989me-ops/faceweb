import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  UserData,
  WalletData,
  Transaction,
  Task,
  StakeProject,
  UserStake,
  authApi,
  walletApi,
  transactionApi,
  taskApi,
  stakeApi,
  referralApi,
  notificationApi,
} from "../services/api";

interface AppContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserData | null;
  wallet: WalletData | null;
  transactions: Transaction[];
  transactionsLoading: boolean;
  tasks: Task[];
  tasksLoading: boolean;
  stakeProjects: StakeProject[];
  userStakes: UserStake[];
  stakesLoading: boolean;
  referralStats: any | null;
  referralsLoading: boolean;
  notifications: any[];
  unreadCount: number;
  notificationsLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshStakes: () => Promise<void>;
  refreshReferrals: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshAll: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [transactionsLoading, setTransactionsLoading] =
    useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [stakeProjects, setStakeProjects] = useState<
    StakeProject[]
  >([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [stakesLoading, setStakesLoading] = useState(false);
  const [referralStats, setReferralStats] = useState<
    any | null
  >(null);
  const [referralsLoading, setReferralsLoading] =
    useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      const savedToken = localStorage.getItem("access_token");
      const savedUserStr =
        localStorage.getItem("swiftearn_user");

      if (savedToken && savedUserStr) {
        setToken(savedToken);
        setUser(JSON.parse(savedUserStr));
        setIsAuthenticated(true);
        refreshAll().catch(console.error);
      }
    } catch (error) {
      clearAuth();
    }
  }

  async function login(email: string, password: string) {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("swiftearn_user");

      const response = await authApi.login({ email, password });

      // BULLETPROOF EXTRACTION: Removes the "Cannot destructure" crash completely
      let finalToken = null;
      let finalUser = null;

      if (response && response.access_token) {
        finalToken = response.access_token;
        finalUser = response.user;
      } else if (
        response &&
        (response as any).data &&
        (response as any).data.access_token
      ) {
        finalToken = (response as any).data.access_token;
        finalUser = (response as any).data.user;
      }

      if (!finalToken) {
        throw new Error("Invalid response format from server.");
      }

      localStorage.setItem("access_token", finalToken);
      localStorage.setItem(
        "swiftearn_user",
        JSON.stringify(finalUser || {}),
      );

      setToken(finalToken);
      setUser(finalUser);
      setIsAuthenticated(true);

      await refreshAll();
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearAuth();
    }
  }

  function clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("swiftearn_user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setWallet(null);
    setTransactions([]);
    setTasks([]);
    setStakeProjects([]);
    setUserStakes([]);
    setReferralStats(null);
    setNotifications([]);
    setUnreadCount(0);
  }

  // FIX: Using localStorage directly bypasses the React Async Trap!
  const hasToken = () => !!localStorage.getItem("access_token");

  async function refreshUser() {
    if (!hasToken()) return;
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
      localStorage.setItem(
        "swiftearn_user",
        JSON.stringify(userData),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function refreshWallet() {
    if (!hasToken()) return;
    try {
      setWallet(await walletApi.getWallet());
    } catch (error) {
      console.error(error);
    }
  }

  async function refreshTransactions() {
    if (!hasToken()) return;
    setTransactionsLoading(true);
    try {
      const txData = await transactionApi.getTransactions();
      setTransactions(
        Array.isArray(txData)
          ? txData
          : (txData as any).transactions || [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setTransactionsLoading(false);
    }
  }

  async function refreshTasks() {
    if (!hasToken()) return;
    setTasksLoading(true);
    try {
      const response = await taskApi.getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setTasksLoading(false);
    }
  }

  async function refreshStakes() {
    if (!hasToken()) return;
    setStakesLoading(true);
    try {
      const [projects, stakes] = await Promise.all([
        stakeApi.getProjects(),
        stakeApi.getUserStakes(),
      ]);
      setStakeProjects(Array.isArray(projects) ? projects : []);
      setUserStakes(Array.isArray(stakes) ? stakes : []);
    } catch (error) {
      console.error(error);
    } finally {
      setStakesLoading(false);
    }
  }

  async function refreshReferrals() {
    if (!hasToken()) return;
    setReferralsLoading(true);
    try {
      setReferralStats(await referralApi.getReferrals());
    } catch (error) {
      console.error(error);
    } finally {
      setReferralsLoading(false);
    }
  }

  async function refreshNotifications() {
    if (!hasToken()) return;
    setNotificationsLoading(true);
    try {
      const notifs = await notificationApi.getNotifications();
      const arr = Array.isArray(notifs) ? notifs : [];
      setNotifications(arr);
      setUnreadCount(arr.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error(error);
    } finally {
      setNotificationsLoading(false);
    }
  }

  async function refreshAll() {
    if (!hasToken()) return;
    await Promise.all([
      refreshUser(),
      refreshWallet(),
      refreshTransactions(),
      refreshTasks(),
      refreshStakes(),
      refreshReferrals(),
      refreshNotifications(),
    ]);
  }

  async function markAllNotificationsRead() {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  }

  const value: AppContextType = {
    isAuthenticated,
    token,
    user,
    wallet,
    transactions,
    transactionsLoading,
    tasks,
    tasksLoading,
    stakeProjects,
    userStakes,
    stakesLoading,
    referralStats,
    referralsLoading,
    notifications,
    unreadCount,
    notificationsLoading,
    login,
    logout,
    refreshUser,
    refreshWallet,
    refreshTransactions,
    refreshTasks,
    refreshStakes,
    refreshReferrals,
    refreshNotifications,
    refreshAll,
    markAllNotificationsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error(
      "useApp must be used within an AppProvider",
    );
  return context;
}

export default AppContext;