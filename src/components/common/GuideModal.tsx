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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleStart} />

            {/* Modal Content - Light Note Theme */}
            <div className={`relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

                {/* Header */}
                <div className="bg-white p-8 flex items-start justify-between border-b border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">このツールの使い方</h2>
                            <p className="text-sm text-gray-500 mt-1">3ステップで記事生成をサポートします</p>
                        </div>
                    </div>
                    <button onClick={handleStart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Step 1 */}
                    <div className="bg-gray-50 rounded-2xl p-5 flex gap-5 border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow shadow-green-500/20">1</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-1">素材（ノウハウ）を準備</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                あなたの頭の中にある<span className="font-bold text-green-600">一次情報やメモ、箇条書き</span>をテキストエリアに貼り付けてください。これが記事の核となります。
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-50 rounded-2xl p-5 flex gap-5 border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow shadow-green-500/20">2</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-1">ターゲットと戦略（任意）</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                誰に何を伝えたいか。<span className="font-bold text-green-600">「カスタマイズ計画」</span>でターゲットやコンセプトを指定すると、より刺さる記事に仕上がります。
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-gray-50 rounded-2xl p-5 flex gap-5 border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow shadow-green-500/20">3</div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-1">AIにおまかせ生成</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                生成ボタンをクリックして待つだけ。AIが<span className="font-bold text-green-600">note投稿の土台となる高品質な下書き</span>を作成します。
                            </p>
                        </div>
                    </div>

                    {/* Hint Section */}
                    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mt-2">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg flex-shrink-0 border border-orange-100">
                                <Lightbulb className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2 text-sm">活用のヒント</h3>
                                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                                    <li><span className="font-semibold text-orange-600">段階的上級者向け設定</span>を使えば、目次を確認しながらこだわって作れます</li>
                                    <li>生成完了まで<span className="font-semibold text-orange-600">約30〜60秒</span>ほどお待ちください（文章量によります）</li>
                                    <li>記事の内容に合った<span className="font-semibold text-orange-600">アイキャッチ画像の生成</span>もサポートしています</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <span className="text-sm text-gray-500">次回から表示しない</span>
                    </label>
                    <button
                        onClick={handleStart}
                        className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg shadow-green-500/30 transform transition-transform active:scale-95"
                    >
                        はじめる
                    </button>
                </div>

            </div>
        </div>
    );
}
