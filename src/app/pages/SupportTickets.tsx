import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare, Plus, X, ArrowLeft, Paperclip,
  Send, Clock, CheckCircle, AlertCircle, RefreshCw,
  ChevronRight, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { supportApi } from "../../services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface TicketReply {
  id: number;
  ticket_id: number;
  author_type: "user" | "admin";
  author_id: number;
  body: string;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_url: string | null;
  created_at: string;
}

interface Ticket {
  id: number;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  last_reply_at: string | null;
  created_at: string;
  replies?: TicketReply[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
  open:        { label: "Open",        icon: Clock,       cls: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30" },
  in_progress: { label: "In Progress", icon: RefreshCw,   cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"             },
  resolved:    { label: "Resolved",    icon: CheckCircle, cls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" },
  closed:      { label: "Closed",      icon: ShieldAlert, cls: "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50"        },
};

const PRIORITY_CLS: Record<string, string> = {
  low:    "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50",
  medium: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
  high:   "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20",
  urgent: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20",
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.open;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${meta.cls}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls = PRIORITY_CLS[priority] ?? PRIORITY_CLS.medium;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cls}`}>
      {priority}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function SupportTickets() {
  const { user } = useApp();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  // Create form state
  const [newSubject, setNewSubject]     = useState("");
  const [newCategory, setNewCategory]   = useState("general");
  const [newPriority, setNewPriority]   = useState("medium");
  const [newBody, setNewBody]           = useState("");
  const [newFile, setNewFile]           = useState<File | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Reply form state
  const [replyBody, setReplyBody]   = useState("");
  const [replyFile, setReplyFile]   = useState<File | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await supportApi.getTickets();
      setTickets(res.data ?? res);
    } catch {
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const openTicket = async (id: number) => {
    try {
      const res = await supportApi.getTicket(id);
      setActiveTicket(res);
    } catch {
      toast.error("Failed to load ticket.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newBody.trim()) return;
    setCreateLoading(true);
    try {
      const fd = new FormData();
      fd.append("subject",  newSubject);
      fd.append("category", newCategory);
      fd.append("priority", newPriority);
      fd.append("body",     newBody);
      if (newFile) fd.append("attachment", newFile);

      const res = await supportApi.createTicket(fd);
      toast.success("Ticket submitted successfully!");
      setShowCreate(false);
      setNewSubject(""); setNewCategory("general");
      setNewPriority("medium"); setNewBody(""); setNewFile(null);
      setTickets((prev) => [res.ticket, ...prev]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit ticket.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyBody.trim()) return;
    setReplyLoading(true);
    try {
      const fd = new FormData();
      fd.append("body", replyBody);
      if (replyFile) fd.append("attachment", replyFile);

      const res = await supportApi.reply(activeTicket.id, fd);
      toast.success("Reply sent.");
      setReplyBody(""); setReplyFile(null);
      setActiveTicket((prev) =>
        prev ? { ...prev, replies: [...(prev.replies ?? []), res.reply] } : prev
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to send reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-2">Support Center</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Submit and track your support requests.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black italic uppercase tracking-tight text-sm px-6 py-3.5 rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-8 h-8 text-slate-400 dark:text-slate-600 animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/50 rounded-[32px] p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5 border border-slate-200 dark:border-slate-700">
            <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight text-xl mb-2">No Tickets Yet</p>
          <p className="text-slate-400 dark:text-slate-500 font-medium mb-6">Submit a ticket and our support team will respond promptly.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black italic uppercase tracking-tight text-sm px-6 py-3 rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            Submit Your First Ticket
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => openTicket(ticket.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-500/30 hover:shadow-md dark:hover:shadow-cyan-500/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center shrink-0 group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30 transition-colors">
                <MessageSquare className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-bold truncate mb-1">{ticket.subject}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] font-medium capitalize">
                    {ticket.category.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-slate-400 dark:text-slate-500 text-xs mb-1">
                  {timeAgo(ticket.last_reply_at ?? ticket.created_at)}
                </p>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Create Ticket Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[36px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">New Ticket</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Support Request</p>
                  </div>
                </div>
                <button
                  type="button"
                  title="Close"
                  onClick={() => setShowCreate(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    maxLength={255}
                    placeholder="Briefly describe your issue…"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-2">Category</label>
                    <select
                      title="Category"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500/50 transition-all"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="billing">Billing</option>
                      <option value="technical">Technical</option>
                      <option value="kyc">KYC / Verification</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-2">Priority</label>
                    <select
                      title="Priority"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500/50 transition-all"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-2">Description</label>
                  <textarea
                    required
                    rows={5}
                    maxLength={5000}
                    placeholder="Describe your issue in detail…"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all resize-none"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-2">Attachment (optional)</label>
                  <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 cursor-pointer hover:border-cyan-500/50 transition-all">
                    <Paperclip className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {newFile ? newFile.name : "Upload screenshot or document (max 5 MB)"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {newFile && (
                    <button
                      type="button"
                      onClick={() => setNewFile(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs mt-1 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remove file
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 italic uppercase tracking-tight"
                >
                  {createLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Ticket</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Ticket Thread Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTicket(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[36px] shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Thread header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    title="Back to tickets"
                    onClick={() => setActiveTicket(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-slate-900 dark:text-white font-black italic tracking-tight text-lg truncate">{activeTicket.subject}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <StatusBadge status={activeTicket.status} />
                      <PriorityBadge priority={activeTicket.priority} />
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] capitalize">{activeTicket.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  title="Close"
                  onClick={() => setActiveTicket(null)}
                  className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reply thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
                {(activeTicket.replies ?? []).map((reply) => {
                  const isAdmin = reply.author_type === "admin";
                  return (
                    <div key={reply.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 space-y-2 ${
                        isAdmin
                          ? "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50"
                          : "bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30"
                      }`}>
                        <div className="flex items-center justify-between gap-4">
                          <span className={`text-[10px] font-black tracking-widest uppercase ${isAdmin ? "text-slate-500 dark:text-slate-400" : "text-cyan-600 dark:text-cyan-400"}`}>
                            {isAdmin ? "Support Team" : "You"}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px]">{timeAgo(reply.created_at)}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                        {reply.attachment_url && (
                          <a
                            href={reply.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-cyan-500 dark:text-cyan-400 text-xs font-bold hover:underline pt-1 border-t border-slate-200 dark:border-slate-700/40 block mt-2"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            {reply.attachment_name ?? "Attachment"}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply form */}
              {!["closed", "resolved"].includes(activeTicket.status) ? (
                <form
                  onSubmit={handleReply}
                  className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 shrink-0"
                >
                  <textarea
                    rows={3}
                    required
                    placeholder="Write your reply…"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all resize-none"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                      <Paperclip className="w-4 h-4" />
                      {replyFile ? <span className="text-cyan-500 dark:text-cyan-400 truncate max-w-[120px]">{replyFile.name}</span> : "Attach"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setReplyFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {replyFile && (
                      <button type="button" title="Remove attachment" onClick={() => setReplyFile(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={replyLoading || !replyBody.trim()}
                      className="ml-auto inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black italic uppercase tracking-tight text-xs px-5 py-2.5 rounded-xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all disabled:opacity-50"
                    >
                      {replyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-sm shrink-0">
                  This ticket is {activeTicket.status}. Contact support to re-open it.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
