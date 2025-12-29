// 記事生成に関する型定義

// 文体の種類
export type WritingStyle = 'polite' | 'formal' | 'friendly';

// 読者層
export type AudienceLevel = 'beginner' | 'intermediate' | 'advanced';

// 生成ステージ
export type GenerationStage = 'input' | 'title' | 'outline' | 'body';

// 文体の日本語ラベル
export const styleLabels: Record<WritingStyle, string> = {
    polite: '丁寧で落ち着いた（ですます調）',
    friendly: 'フレンドリーで親しみやすい',
    formal: '専門的で論理的（である調）',
};

// 読者層の日本語ラベル
export const audienceLabels: Record<AudienceLevel, string> = {
    beginner: '初心者向け',
    intermediate: '中級者向け',
    advanced: '専門家向け',
};

// 文字数オプション
export const wordCountOptions = [
    { value: 2500, label: '2,500文字' },
    { value: 5000, label: '5,000文字' },
    { value: 7500, label: '7,500文字' },
    { value: 10000, label: '10,000文字' },
];

/**
 * カスタマイズ計画の設定
 */
export interface StrategySettings {
    title: string;           // 記事タイトル
    target: string;          // ターゲット・読者変容
    concept: string;         // 記事コンセプト
    strength: string;        // 記事の強み
    structure: string;       // 記事構成案（大まかな）
    otherInstructions: string; // その他の指示
}

/**
 * 基本設定
 */
export interface BasicSettings {
    style: WritingStyle;
    audience: AudienceLevel;
    wordCount: number;
    imageTheme: string;
}

/**
 * 構成案のセクション
 */
export interface OutlineSection {
    level: number; // 1=H2, 2=H3
    heading: string;
    summary: string;
}

/**
 * 処理ログの定義
 */
export interface LogEntry {
    timestamp: string; // HH:mm:ss
    category: string;  // [分析], [構成作成], [記事執筆], [画像生成] etc.
    message: string;
}

/**
 * 記事全体のデータ構造
 */
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
    hashtags: string[];

    generatedImageUrl?: string;
    // 使用された画像生成モデル名
    generatedImageModel?: string;
    // 新機能: 参照画像（Base64 string）
    referenceImage?: string;

    // 処理ログ
    logs: LogEntry[];

    // 状態管理
    currentStage: GenerationStage;
    isStepMode: boolean;
    isGenerating: boolean;
    completedStages: GenerationStage[]; // 完了したステージ
}

/**
 * デフォルト値
 */
export const defaultArticleData: ArticleData = {
    knowhow: '',
    strategy: {
        title: '',
        target: '',
        concept: '',
        strength: '',
        structure: '',
        otherInstructions: '',
    },
    settings: {
        style: 'polite',
        audience: 'beginner',
        wordCount: 2500,
        imageTheme: '',
    },
    generatedTitles: [],
    selectedTitle: '',
    outline: [],
    body: '',

    metaDescription: '',
    hashtags: [],
    referenceImage: undefined,
    logs: [],
    currentStage: 'input',
    isStepMode: false,
    isGenerating: false,
    completedStages: ['input'],
};

/**
 * 履歴アイテムの定義
 */
export interface HistoryItem {
    id: string;
    timestamp: number;
    title: string;       // 表示用タイトル（生成されていなければ「無題」など）
    data: ArticleData;
}

// APIリクエスト型定義

export interface TitleRequest {
    knowhow: string;
    strategy?: Partial<StrategySettings>;
    settings: {
        style: WritingStyle;
        audience: AudienceLevel;
    };
}

export interface TitleResponse {
    success: boolean;
    titles?: string[];
    error?: string;
}

export interface OutlineRequest {
    knowhow: string;
    selectedTitle: string;
    strategy?: {
        structure?: string;
        target?: string;
        concept?: string;
        strength?: string;
        otherInstructions?: string;
    };
    settings: {
        wordCount: number;
        audience: string;
    };
}

export interface OutlineResponse {
    success: boolean;
    outline?: {
        sections: OutlineSection[];
    };
    error?: string;
}

export interface BodyRequest {
    knowhow: string;
    selectedTitle: string;
    outline: {
        sections: OutlineSection[];
    };
    strategy?: Partial<StrategySettings>;

    settings: {
        style: WritingStyle;
        audience: string;
        wordCount: number;
    };
    referenceImage?: string;
}

export interface BodyResponse {
    success: boolean;

    body?: {
        markdown: string;
        metaDescription: string;
        hashtags: string[];
        actualWordCount: number;
        generatedImageUrl?: string;
        generatedImageModel?: string;
    };
    error?: string;
}
