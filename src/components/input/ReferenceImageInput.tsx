
import React, { useRef } from 'react';
import { useArticle } from '../../contexts/ArticleContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export function ReferenceImageInput() {
    const { articleData, setReferenceImage } = useArticle();
    const { referenceImage } = articleData;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('画像ファイルを選択してください');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('画像サイズは5MB以下にしてください');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setReferenceImage(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleClear = () => {
        setReferenceImage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-5 h-5 text-[#41c9b4]" />
                <h3 className="font-bold text-gray-700">参照画像（キャラクター・スタイル）</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">任意</span>
            </div>

            <p className="text-sm text-gray-500 mb-2">
                アイキャッチ画像に反映したいキャラクターや雰囲気の元画像をアップロードできます。
            </p>

            {!referenceImage ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-[#41c9b4] transition-all cursor-pointer group"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#41c9b4]/10 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#41c9b4]" />
                    </div>
                    <p className="font-bold text-gray-600 group-hover:text-[#41c9b4]">画像をアップロード</p>
                    <p className="text-xs text-gray-400 mt-1">またはドラッグ＆ドロップ</p>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img
                        src={referenceImage}
                        alt="Reference"
                        className="w-full h-48 object-contain bg-gray-800/50 backdrop-blur-sm" // contain to show full image
                    />
                    <button
                        onClick={handleClear}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                        title="画像を削除"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center text-white text-xs">
                        この画像の要素をアイキャッチ生成に反映します
                    </div>
                </div>
            )}
        </div>
    );
}
