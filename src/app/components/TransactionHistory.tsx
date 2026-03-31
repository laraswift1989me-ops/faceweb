import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp, Gift, CheckCircle } from 'lucide-react';
import { Transaction } from '../services/api';

interface TransactionItemProps {
  transaction: Transaction;
  compact?: boolean;
}

export function TransactionItem({ transaction, compact = false }: TransactionItemProps) {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDownCircle className="w-5 h-5" />;
      case 'withdrawal':
        return <ArrowUpCircle className="w-5 h-5" />;
      case 'stake':
        return <Wallet className="w-5 h-5" />;
      case 'harvest':
        return <TrendingUp className="w-5 h-5" />;
      case 'referral':
        return <Gift className="w-5 h-5" />;
      case 'task':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'withdrawal':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'stake':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'harvest':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'referral':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'task':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case 'completed':
        return (
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full font-bold">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-1 rounded-full font-bold">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getAmountDisplay = () => {
    const amount = parseFloat(transaction.amount);
    const prefix = transaction.type === 'withdrawal' ? '-' : '+';
    
    return `${prefix}${amount.toFixed(2)} USDT`;
  };

  const getAmountColor = () => {
    if (transaction.status === 'failed') return 'text-slate-500';
    return transaction.type === 'withdrawal' ? 'text-rose-400' : 'text-emerald-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-xl border ${getTransactionColor()}`}>
            {getTransactionIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{transaction.description}</p>
            <p className="text-slate-500 text-xs">{formatDate(transaction.created_at)}</p>
          </div>
        </div>
        <div className="text-right ml-3">
          <p className={`font-black text-sm ${getAmountColor()}`}>{getAmountDisplay()}</p>
          {getStatusBadge()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border ${getTransactionColor()}`}>
            {getTransactionIcon()}
          </div>
          <div>
            <h4 className="text-white font-bold">{transaction.description}</h4>
            <p className="text-slate-500 text-xs mt-1">
              ID: #{transaction.id} • {formatDate(transaction.created_at)}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <span className="text-slate-400 text-sm font-medium">Amount</span>
        <span className={`font-black text-lg ${getAmountColor()}`}>{getAmountDisplay()}</span>
      </div>
    </div>
  );
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
  compact?: boolean;
  maxItems?: number;
}

export function TransactionHistory({ 
  transactions, 
  loading = false, 
  compact = false,
  maxItems 
}: TransactionHistoryProps) {
  const displayTransactions = maxItems ? transactions.slice(0, maxItems) : transactions;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-700/50 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50 text-center">
        <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 font-bold">No transactions yet</p>
        <p className="text-slate-600 text-sm mt-1">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {displayTransactions.map((transaction) => (
        <TransactionItem 
          key={transaction.id} 
          transaction={transaction}
          compact={compact}
        />
      ))}
    </div>
  );
}
