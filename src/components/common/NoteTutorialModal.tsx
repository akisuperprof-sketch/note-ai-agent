import { X, Image, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NoteTutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NoteTutorialModal({ isOpen, onClose }: NoteTutorialModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className={`relative w-full max-w-3xl bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Image className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">noteへの投稿手順</h2>
                            <p className="text-emerald-100 text-sm">作成した記事と画像をnoteに貼り付けましょう</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Step 1 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center text-xl font-bold text-gray-300 shadow-lg">1</div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-400 mb-2">noteの記事作成画面を開く</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    noteにログインし、右上の「投稿」ボタンから「記事」を選択して新規作成画面を開きます。
                                </p>
                            </div>
                            <a
                                href="https://note.com/notes/new"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2cbe78] hover:bg-[#25a568] text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-900/20"
                            >
                                <ExternalLink className="w-4 h-4" />
                                note投稿画面を開く
                            </a>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center text-xl font-bold text-gray-300 shadow-lg">2</div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-400 mb-2">本文を貼り付ける</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    先ほどコピーした記事の本文を、noteの本文エリアに貼り付けます。<br />
                                    <span className="text-xs text-gray-500 mt-1 block">※タイトルは別途入力してください。</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center text-xl font-bold text-gray-300 shadow-lg">3</div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-400 mb-2">見出し画像をアップロード</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    記事のトップにある画像アイコンをクリックし、生成された画像をアップロードします。<br />
                                    画像があることで、記事のクリック率が大幅に向上します。
                                </p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-700 flex items-center justify-center text-gray-500 text-sm">
                                <Image className="w-4 h-4 mr-2" />
                                ここに見出し画像を設定
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-900 border-t border-gray-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        閉じる
                    </button>
                </div>

            </div>
        </div>
    );
}
