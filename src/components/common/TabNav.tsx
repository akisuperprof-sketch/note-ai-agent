import type { GenerationStage } from '../../types';
import { FileText, Lightbulb, List, PenTool } from 'lucide-react';

interface TabNavProps {
    currentStage: GenerationStage;
    onStageChange: (stage: GenerationStage) => void;
    isStepMode: boolean;
    completedStages: GenerationStage[];
}

const tabs: { id: GenerationStage; label: string; icon: React.ReactNode }[] = [
    { id: 'input', label: '入力', icon: <FileText className="w-4 h-4" /> },
    { id: 'title', label: 'タイトル案', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'outline', label: '構成案', icon: <List className="w-4 h-4" /> },
    { id: 'body', label: '本文', icon: <PenTool className="w-4 h-4" /> },
];

export function TabNav({ currentStage, onStageChange, isStepMode, completedStages }: TabNavProps) {
    const isTabAccessible = (tabId: GenerationStage): boolean => {
        if (!isStepMode) return true;

        const stageOrder: GenerationStage[] = ['input', 'title', 'outline', 'body'];
        const currentIndex = stageOrder.indexOf(currentStage);
        const tabIndex = stageOrder.indexOf(tabId);

        // 現在のステージ以下、または完了済みステージはアクセス可能
        return tabIndex <= currentIndex || completedStages.includes(tabId);
    };

    return (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {tabs.map((tab) => {
                const isActive = currentStage === tab.id;
                const accessible = isTabAccessible(tab.id);

                return (
                    <button
                        key={tab.id}
                        onClick={() => accessible && onStageChange(tab.id)}
                        disabled={!accessible}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive
                                ? 'bg-white text-primary-600 shadow-sm'
                                : accessible
                                    ? 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    : 'text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
