import { X, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleStart = () => {
        if (dontShowAgain) {
            localStorage.setItem('hasSeenGuide', 'true');
        }
        onClose();
    };

    if (!isVisible && !isOpen) return null;

    return (
  return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleStart} />

            {/* Modal Content - Dark Theme */}
            <div className={`relative w-full max-w-2xl bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex items-start justify-between border-b border-white/5">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">このツールの使い方</h2>
                            <p className="text-sm text-gray-400 mt-1">3ステップで記事を生成できます</p>
                        </div>
                    </div>
                    <button onClick={handleStart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Step 1 */}
                    <div className="bg-gray-800/50 rounded-2xl p-5 flex gap-5 border border-white/5">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow shadow-blue-500/20">1</div>
                        <div>
                            <h3 className="font-bold text-blue-300 mb-1">ノウハウを入力</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                マインドマップやメモで整理した<span className="font-bold text-blue-400">あなたの一次情報・ノウハウ</span>をテキストエリアに貼り付けます。
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-800/50 rounded-2xl p-5 flex gap-5 border border-white/5">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow shadow-purple-500/20">2</div>
                        <div>
                            <h3 className="font-bold text-purple-300 mb-1">戦略企画を設定（任意）</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                タイトル、ターゲット、差別化ポイントなどを<span className="font-bold text-purple-400">「戦略企画」</span>に入力すると、より狙い通りの記事になります。
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-gray-800/50 rounded-2xl p-5 flex gap-5 border border-white/5">
                        <div className="flex-shrink-0 w-10 h-10 bg-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow shadow-pink-500/20">3</div>
                        <div>
                            <h3 className="font-bold text-pink-300 mb-1">生成してコピー</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                「記事を生成する」ボタンを押して待つだけ。完成したら<span className="font-bold text-pink-400">ワンクリックでコピー</span>してnoteに貼り付けられます。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-900/50 flex items-center justify-between border-t border-white/5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <span className="text-sm text-gray-400">次回から表示しない</span>
                    </label>
                    <button
                        onClick={handleStart}
                        className="px-10 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transform transition-transform active:scale-95"
                    >
                        はじめる
                    </button>
                </div>

            </div>
        </div>
    );
}
