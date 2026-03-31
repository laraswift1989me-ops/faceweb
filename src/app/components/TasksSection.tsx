import { useState } from "react";
import {
  CheckCircle2,
  Gift,
  PlayCircle,
  Share2,
  Users,
  Wallet,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { taskApi } from "../../services/api";

export function TasksSection() {
  const [claimingId, setClaimingId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Pull live tasks and user data from context
  const { tasks, user, refreshAll } = useApp();

  const handleClaim = async (taskId: number) => {
    setClaimingId(taskId);
    setError(null);
    try {
      await taskApi.completeTask(taskId);
      await refreshAll(); // Refreshes task list and adds funds to locked wallet
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to claim task. You may have already claimed this today.",
      );
    } finally {
      setClaimingId(null);
    }
  };

  const getIcon = (actionKey: string) => {
    if (
      actionKey.includes("login") ||
      actionKey.includes("check_in")
    )
      return <CheckCircle2 className="w-5 h-5" />;
    if (
      actionKey.includes("share") ||
      actionKey.includes("social")
    )
      return <Share2 className="w-5 h-5" />;
    if (
      actionKey.includes("invite") ||
      actionKey.includes("refer")
    )
      return <Users className="w-5 h-5" />;
    if (actionKey.includes("deposit"))
      return <Wallet className="w-5 h-5" />;
    if (
      actionKey.includes("watch") ||
      actionKey.includes("tutorial")
    )
      return <PlayCircle className="w-5 h-5" />;
    return <Gift className="w-5 h-5" />;
  };

  // Calculate Streak Math
  const streakDays = user?.daily_task_streak || 0;
  const streakProgress = (streakDays / 7) * 100;

  // Calculate Daily Progress
  const dailyTasks = tasks.filter((t) => t.type === "daily");
  const claimedDaily = dailyTasks.filter(
    (t) => t.status === "Claimed",
  ).length;
  const totalDaily = dailyTasks.length || 1; // Prevent divide by zero
  const dailyProgress = (claimedDaily / totalDaily) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl lg:text-2xl font-bold">
            Daily Quests
          </h2>
          <div className="bg-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold border border-cyan-500/30">
            {claimedDaily}/{totalDaily}
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            <span>Daily Progress</span>
            <span className="text-emerald-400">
              Complete all to level up streak
            </span>
          </div>
          <div className="h-3 bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-rose-200 text-sm">{error}</p>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const isClaimed = task.status === "Claimed";
            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  isClaimed
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isClaimed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-900 text-cyan-400 border border-slate-700"
                    }`}
                  >
                    {getIcon(task.action_key || "gift")}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1">
                      {task.title}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-cyan-400 text-xs font-bold">
                      <Gift className="w-3.5 h-3.5" />+
                      {parseFloat(task.reward).toFixed(2)} USDT
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(task.id)}
                  disabled={isClaimed || claimingId === task.id}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 min-w-[120px] ${
                    isClaimed
                      ? "text-emerald-400 bg-emerald-500/10 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:opacity-90 shadow-lg shadow-cyan-500/20"
                  }`}
                >
                  {claimingId === task.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Done
                    </>
                  ) : (
                    "Claim Reward"
                  )}
                </button>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
              Loading tasks...
            </div>
          )}
        </div>

        {/* Weekly Streak Bonus Card */}
        <div className="mt-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">
                  Weekly Streak Bonus
                </h3>
                <p className="text-purple-300 text-xs md:text-sm">
                  Complete all daily tasks for 7 days straight
                </p>
                <div className="flex items-center gap-1 mt-1 text-pink-400 text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  +100.00 USDT
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto text-right">
              <span className="text-white font-bold text-sm mb-2 block">
                Day {streakDays}/7
              </span>
              <div className="w-full md:w-32 h-2 bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-1000"
                  style={{ width: `${streakProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}