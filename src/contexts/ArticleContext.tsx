import { createContext, useContext, useState, type ReactNode } from 'react';
import {
    type ArticleData,
    type GenerationStage,
    type StrategySettings,
    type BasicSettings,
    type OutlineSection,
    defaultArticleData,
} from '../types';

export interface ArticleContextType {
    articleData: ArticleData;

    // 入力更新
    setKnowhow: (knowhow: string) => void;
    updateStrategy: (key: keyof StrategySettings, value: string) => void;
    updateSettings: (key: keyof BasicSettings, value: string | number) => void;

    // 生成結果更新
    setGeneratedTitles: (titles: string[]) => void;
    setSelectedTitle: (title: string) => void;
    setOutline: (outline: OutlineSection[]) => void;
    setBody: (body: string, metaDescription?: string) => void;

    // 状態管理
    setCurrentStage: (stage: GenerationStage) => void;
    setIsStepMode: (isStepMode: boolean) => void;
    setIsGenerating: (isGenerating: boolean) => void;

    // リセット
    resetAll: () => void;
    resetFromStage: (stage: GenerationStage) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
    const [articleData, setArticleData] = useState<ArticleData>(defaultArticleData);

    const setKnowhow = (knowhow: string) => {
        setArticleData(prev => ({ ...prev, knowhow }));
    };

    const updateStrategy = (key: keyof StrategySettings, value: string) => {
        setArticleData(prev => ({
            ...prev,
            strategy: { ...prev.strategy, [key]: value },
        }));
    };

    const updateSettings = (key: keyof BasicSettings, value: string | number) => {
        setArticleData(prev => ({
            ...prev,
            settings: { ...prev.settings, [key]: value },
        }));
    };

    const setGeneratedTitles = (titles: string[]) => {
        setArticleData(prev => ({ ...prev, generatedTitles: titles }));
    };

    const setSelectedTitle = (title: string) => {
        setArticleData(prev => ({ ...prev, selectedTitle: title }));
    };

    const setOutline = (outline: OutlineSection[]) => {
        setArticleData(prev => ({ ...prev, outline }));
    };

    const setBody = (body: string, metaDescription?: string) => {
        setArticleData(prev => ({
            ...prev,
            body,
            metaDescription: metaDescription || prev.metaDescription,
        }));
    };

    const setCurrentStage = (stage: GenerationStage) => {
        setArticleData(prev => ({ ...prev, currentStage: stage }));
    };

    const setIsStepMode = (isStepMode: boolean) => {
        setArticleData(prev => ({ ...prev, isStepMode }));
    };

    const setIsGenerating = (isGenerating: boolean) => {
        setArticleData(prev => ({ ...prev, isGenerating }));
    };

    const resetAll = () => {
        setArticleData(defaultArticleData);
    };

    const resetFromStage = (stage: GenerationStage) => {
        setArticleData(prev => {
            const newData = { ...prev };

            switch (stage) {
                case 'input':
                    return defaultArticleData;
                case 'title':
                    newData.generatedTitles = [];
                    newData.selectedTitle = '';
                    newData.outline = [];
                    newData.body = '';
                    newData.metaDescription = '';
                    break;
                case 'outline':
                    newData.outline = [];
                    newData.body = '';
                    newData.metaDescription = '';
                    break;
                case 'body':
                    newData.body = '';
                    newData.metaDescription = '';
                    break;
            }

            return newData;
        });
    };

    return (
        <ArticleContext.Provider
            value={{
                articleData,
                setKnowhow,
                updateStrategy,
                updateSettings,
                setGeneratedTitles,
                setSelectedTitle,
                setOutline,
                setBody,
                setCurrentStage,
                setIsStepMode,
                setIsGenerating,
                resetAll,
                resetFromStage,
            }}
        >
            {children}
        </ArticleContext.Provider>
    );
}

export function useArticle() {
    const context = useContext(ArticleContext);
    if (context === undefined) {
        throw new Error('useArticle must be used within an ArticleProvider');
    }
    return context;
}
