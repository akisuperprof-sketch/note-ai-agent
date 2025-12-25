import type { HistoryItem } from '../../types';
import { Clock, Trash2, X, FileText } from 'lucide-react';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
}

export function HistoryModal({ isOpen, onClose, history, onSelect, onDelete }: HistoryModalProps) {
    if (!isOpen) return null;

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleString('ja-JP', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-xl">
                    <h3 className="font-bold text-xl text-white flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary-400" />
                        生成履歴
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>保存された履歴はありません</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <div
                                key={item.id}
                                className="group relative bg-gray-900/30 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 hover:border-primary-500/30 transition-all overflow-hidden"
                            >
                                <button
                                    onClick={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                    className="w-full text-left p-4 pr-12"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-bold text-gray-200 line-clamp-1">{item.title}</h4>
                                        <span className="text-xs text-gray-500 whitespace-nowrap pt-1 ml-2 font-mono">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                                        {item.data.knowhow}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.data.currentStage === 'body'
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                            }`}>
                                            {item.data.currentStage === 'body' ? '完了' : '作成中'}
                                        </span>
                                        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                                            {item.data.settings.wordCount.toLocaleString()}文字設定
                                        </span>
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('この履歴を削除しますか？')) onDelete(item.id);
                                    }}
                                    className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="履歴を削除"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 bg-gray-900/30 rounded-b-xl text-center text-xs text-gray-500">
                    履歴はブラウザに保存されます（最大50件）
                </div>
            </div>
        </div>
    );
}
