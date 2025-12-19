// 記事生成に関する型定義

// 文体の種類
export type WritingStyle = 'polite' | 'formal' | 'friendly';

// 読者層
export type AudienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'general';

// 生成ステージ
export type GenerationStage = 'input' | 'title' | 'outline' | 'body';

// 戦略企画設定
export interface StrategySettings {
    title: string;
    target: string;
    concept: string;
    strength: string;
    structure: string;
    otherInstructions: string;
}

// 基本設定
export interface BasicSettings {
    style: WritingStyle;
    audience: AudienceLevel;
    wordCount: number;
    imageTheme: string;
}

// 構成のセクション
export interface OutlineSection {
    level: number;
    heading: string;
    summary: string;
}

// 記事データ全体
export interface ArticleData {
    // 入力データ
    knowhow: string;
    strategy: StrategySettings;
    settings: BasicSettings;

    // 生成結果
    generatedTitles: string[];
    selectedTitle: string;
    outline: OutlineSection[];
    body: string;
    metaDescription: string;

    // 状態
    currentStage: GenerationStage;
    isStepMode: boolean;
    isGenerating: boolean;
}

// デフォルト値
export const defaultStrategy: StrategySettings = {
    title: '',
    target: '',
    concept: '',
    strength: '',
    structure: '',
    otherInstructions: '',
};

export const defaultSettings: BasicSettings = {
    style: 'polite',
    audience: 'beginner',
    wordCount: 5000,
    imageTheme: '',
};

export const defaultArticleData: ArticleData = {
    knowhow: '',
    strategy: defaultStrategy,
    settings: defaultSettings,
    generatedTitles: [],
    selectedTitle: '',
    outline: [],
    body: '',
    metaDescription: '',
    currentStage: 'input',
    isStepMode: false,
    isGenerating: false,
};

// API レスポンス型
export interface TitleResponse {
    success: boolean;
    titles?: string[];
    error?: string;
}

export interface OutlineResponse {
    success: boolean;
    outline?: {
        sections: OutlineSection[];
    };
    error?: string;
}

export interface BodyResponse {
    success: boolean;
    body?: {
        markdown: string;
        metaDescription: string;
        actualWordCount: number;
    };
    error?: string;
}

// 文体の日本語ラベル
export const styleLabels: Record<WritingStyle, string> = {
    polite: 'ですます調（丁寧）',
    formal: 'である調（簡潔）',
    friendly: 'フレンドリー',
};

// 読者層の日本語ラベル
export const audienceLabels: Record<AudienceLevel, string> = {
    beginner: '初心者向け',
    intermediate: '中級者向け',
    advanced: '上級者向け',
    general: '一般向け',
};

// 文字数オプション
export const wordCountOptions = [
    { value: 1000, label: '1,000文字' },
    { value: 3000, label: '3,000文字' },
    { value: 5000, label: '5,000文字' },
    { value: 10000, label: '10,000文字' },
];
