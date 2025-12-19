import { HelpCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img src="/logo-wide.jpeg" alt="Logo" className="w-auto h-32 rounded-2xl shadow-lg shadow-purple-500/20" />
                        {/* Title removed as text is now in the logo, or kept if user wants both? 
                            The user said "Use this logo", and previously the prompt for the logo included text "Note AI AGENT".
                            If the logo has text, we might not need the h1. 
                            However, the previous edit kept the h1. 
                            The user said "logo-wide.jpeg". 
                            Let's keep the h1 for SEO/Accessibility but maybe hide it visually if the logo has text? 
                            Actually, the user request "logo is good... 1:8 ratio" implies the logo contains the title.
                            But I'll keep the H1 for now to be safe, or maybe just update the image src.
                            The user said "横長のロゴにしてください。1:8くらいにして欲しい" (Make it a wide logo, about 1:8).
                            The uploaded image likely contains the text.
                            I will update the src to /logo-wide.jpeg and adjust width/height to fit. 
                            Since it's 1:8, w-32 h-32 (square) is wrong.
                            It should be like h-20 w-auto.
                         */}
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500">
                                note記事全自動AIエージェント
                            </h1>
                        </div>
                    </div>

                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <HelpCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
