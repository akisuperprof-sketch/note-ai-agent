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
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleStart} />

            {/* Modal Content - Light Theme based on design */}
            <div className={`relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 flex items-start justify-between border-b border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">このツールの使い方</h2>
                            <p className="text-sm text-gray-500 mt-1">3ステップで記事を生成できます</p>
                        </div>
                    </div>
                    <button onClick={handleStart} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Step 1 */}
                    <div className="bg-blue-50 rounded-2xl p-5 flex gap-5 border border-blue-100">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-blue-200">1</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">ノウハウを入力</h3>
                            <p className="text-sm text-blue-800/80 leading-relaxed">
                                マインドマップやメモで整理した<span className="font-bold text-blue-700">あなたの一次情報・ノウハウ</span>をテキストエリアに貼り付けます。
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-purple-50 rounded-2xl p-5 flex gap-5 border border-purple-100">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-purple-200">2</div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-1">戦略企画を設定（任意）</h3>
                            <p className="text-sm text-purple-800/80 leading-relaxed">
                                タイトル、ターゲット、差別化ポイントなどを<span className="font-bold text-purple-700">「戦略企画」</span>に入力すると、より狙い通りの記事になります。
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-pink-50 rounded-2xl p-5 flex gap-5 border border-pink-100">
                        <div className="flex-shrink-0 w-10 h-10 bg-pink-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-pink-200">3</div>
                        <div>
                            <h3 className="font-bold text-pink-900 mb-1">生成してコピー</h3>
                            <p className="text-sm text-pink-800/80 leading-relaxed">
                                「記事を生成する」ボタンを押して待つだけ。完成したら<span className="font-bold text-pink-700">ワンクリックでコピー</span>してnoteに貼り付けられます。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <span className="text-sm text-gray-600">次回から表示しない</span>
                    </label>
                    <button
                        onClick={handleStart}
                        className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transform transition-transform active:scale-95"
                    >
                        はじめる
                    </button>
                </div>

            </div>
        </div>
    );
}
