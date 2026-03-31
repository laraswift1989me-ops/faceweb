import { useState } from "react";
import {
  Cpu,
  ShoppingCart,
  Video,
  TrendingUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { stakeApi } from "../../services/api";

export function EarnProjects() {
  const [activeTab, setActiveTab] = useState<
    "projects" | "mystakes"
  >("projects");
  const [loadingId, setLoadingId] = useState<number | null>(
    null,
  );
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Pull live data from our global context
  const { stakeProjects, userStakes, refreshAll } = useApp();

  const getIcon = (name: string) => {
    if (
      name.toLowerCase().includes("ai") ||
      name.toLowerCase().includes("bot")
    )
      return <Cpu className="w-6 h-6 text-blue-400" />;
    if (name.toLowerCase().includes("commerce"))
      return (
        <ShoppingCart className="w-6 h-6 text-emerald-400" />
      );
    if (
      name.toLowerCase().includes("content") ||
      name.toLowerCase().includes("media")
    )
      return <Video className="w-6 h-6 text-pink-400" />;
    return <TrendingUp className="w-6 h-6 text-purple-400" />;
  };

  const handleStake = async (projectId: number) => {
    if (
      !stakeAmount ||
      isNaN(Number(stakeAmount)) ||
      Number(stakeAmount) <= 0
    ) {
      setError("Please enter a valid amount to stake.");
      return;
    }

    setLoadingId(projectId);
    setError(null);

    try {
      await stakeApi.createStake({
        project_id: projectId,
        amount: Number(stakeAmount),
      });

      setStakeAmount("");
      setSelectedProject(null);
      await refreshAll(); // Instantly update balances and active stakes!
      setActiveTab("mystakes"); // Switch to their stakes tab to show success
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to stake funds. Check your available balance.",
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleHarvest = async () => {
    if (userStakes.length === 0) return;
    setLoadingId(-1);
    setError(null);

    const errors: string[] = [];
    for (const s of userStakes) {
      try {
        await stakeApi.harvest(s.id);
      } catch (err: any) {
        errors.push(err.message || `Failed to harvest stake #${s.id}`);
      }
    }
    await refreshAll();
    setLoadingId(null);
    if (errors.length > 0) {
      setError(errors.join(" | "));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl lg:text-3xl font-black mb-2">
            Investment Projects
          </h1>
          <p className="text-slate-400">
            Choose from our curated online business
            opportunities
          </p>
        </div>

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "projects"
                ? "bg-slate-800 text-white shadow-lg"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Available Projects
          </button>
          <button
            onClick={() => setActiveTab("mystakes")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "mystakes"
                ? "bg-slate-800 text-white shadow-lg"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            My Active Stakes ({userStakes.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-rose-200 text-sm">{error}</p>
        </div>
      )}

      {activeTab === "projects" ? (
        <div className="space-y-4">
          {stakeProjects.map((project) => {
            // Handle both daily_roi and daily_roi_percent field names
            const dailyRoiStr =
              project.daily_roi || project.daily_roi_percent || "0";
            const dailyRoiNum = parseFloat(dailyRoiStr) || 0;

            return (
              <div
                key={project.id}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    {getIcon(project.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-white text-xl font-bold mb-1">
                          {project.name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Lock Duration:{" "}
                          {project.lock_duration_days === 0
                            ? "Flexible"
                            : `${project.lock_duration_days || 90} Days`}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
                          Min Stake
                        </p>
                        <p className="text-white font-bold">
                          ${project.min_stake || 20}
                        </p>
                      </div>
                      <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
                          Daily Profit
                        </p>
                        <p className="text-emerald-400 font-bold">
                          {dailyRoiNum > 0 ? dailyRoiNum.toFixed(2) : "0.00"}%
                        </p>
                      </div>
                    </div>

                    {selectedProject === project.id ? (
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="Amount in USDT"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => handleStake(project.id)}
                          disabled={loadingId === project.id}
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold px-6 py-2 rounded-xl hover:opacity-90 flex items-center gap-2"
                        >
                          {loadingId === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedProject(null)}
                          className="bg-slate-800 text-slate-400 font-bold px-4 py-2 rounded-xl hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedProject(project.id)}
                        className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                      >
                        Stake Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {stakeProjects.length === 0 && (
            <div className="text-center py-12 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
              <p className="text-slate-400">
                Loading investment projects...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleHarvest}
              disabled={
                loadingId === -1 || userStakes.length === 0
              }
              className="bg-gradient-to-r from-emerald-400 to-green-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loadingId === -1 ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
              Harvest All Profits
            </button>
          </div>

          {userStakes.map((stake) => (
            <div
              key={stake.id}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getIcon(stake.project_name)}
                  <h3 className="text-white font-bold text-lg">
                    {stake.project_name}
                  </h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
                    Staked Amount
                  </p>
                  <p className="text-white font-bold">
                    ${parseFloat(stake.amount).toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
                    Daily Rate
                  </p>
                  <p className="text-emerald-400 font-bold">
                    {parseFloat(stake.daily_percent ?? stake.daily_roi ?? 0).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 col-span-2">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
                    Last Harvested
                  </p>
                  <p className="text-slate-300 font-medium">
                    {new Date(
                      stake.last_harvested_at,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {userStakes.length === 0 && (
            <div className="text-center py-12 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">
                No Active Stakes
              </h3>
              <p className="text-slate-400">
                Head over to the projects tab to start earning
                daily yield.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}