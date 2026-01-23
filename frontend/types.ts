export interface UserInput {
  productName: string;
  productDescription: string;
  usp: string;
  brandVoice: string;
  targetLocation: string;
  competitors: string;
  launchObjective: string;
  customerHypothesis: string;
}

// --- Market Analysis Types ---
export interface Demographics {
  age_range: string;
  gender_identity: string;
  location: string;
  income_level: string;
  occupation: string;
}

export interface Psychographics {
  interests: string[];
  values: string[];
  pain_points: string[];
  goals: string[];
  online_behavior: string;
}

export interface MarketingInsights {
  preferred_channels: string[];
  messaging_style: string;
  call_to_action_preference: string;
}

export interface Persona {
  persona_name: string;
  demographics: Demographics;
  psychographics: Psychographics;
  marketing_insights: MarketingInsights;
  quote: string;
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketMavenOutput {
  target_audience_personas: Persona[];
  competitor_summary: any; // Keeping flexible
  research_sources: string[];
}

// --- SEO Types ---
export interface Keyword {
  keyword: string;
  search_intent: string;
  relevance_to_persona: string;
  content_ideas: string[];
}

export interface CategorizedKeywords {
  informational_keywords: Keyword[];
  commercial_investigation_keywords: Keyword[];
  transactional_keywords: Keyword[];
  long_tail_keywords: Keyword[];
}

export interface KeywordResearch {
  overview: string;
  categorized_keywords: CategorizedKeywords;
  search_trends_and_opportunities: { [key: string]: string[] };
}

export interface OnPageOptimization {
  recommendation: string;
  target_content_type: string;
}

export interface SeoContentRecommendations {
  general_guidelines: string[];
  on_page_optimization: OnPageOptimization[];
  content_refinement_suggestions: OnPageOptimization[];
}

export interface SEOStageOutput {
  keyword_research: KeywordResearch;
  seo_content_recommendations: SeoContentRecommendations;
  research_sources: string[];
}

// --- Creative Types ---
export interface ProductDescription {
  description_type: string;
  target_persona: string;
  word_count_target: string;
  copy: string;
  seo_keywords_integrated: string[];
  call_to_action: string;
}

export interface AdCopy {
  ad_platform: string;
  target_persona: string;
  ad_goal: string;
  headline_suggestions: string[];
  description_suggestions: string[];
  call_to_action_options: string[];
  seo_keywords_integrated: string[];
  notes: string;
}

export interface SocialMediaPost {
  platform: string;
  captions: string[];
  hashtags_suggested: string[];
  call_to_action: string;
}

export interface EmailTemplate {
  email_type: string;
  target_persona: string;
  subject_line_suggestions: string[];
  preview_text_suggestion: string;
  body_copy: string;
  call_to_action: string;
}

export interface ContentGeneration {
  product_descriptions: ProductDescription[];
  ad_copy_variations: AdCopy[];
  social_media_posts: SocialMediaPost[];
  email_templates: EmailTemplate[];
}

export interface CreativeWordsmithOutput {
  content_generation: ContentGeneration;
}

export interface ColorDefinition {
  name: string;
  hex_code: string;
  mood_association: string;
  usage_context: string;
}

export interface ColorPalette {
  primary_colors: ColorDefinition[];
  secondary_colors: ColorDefinition[];
  accent_colors: ColorDefinition[];
  color_usage_notes: string;
}

export interface AdCreativeConcept {
  concept_name: string;
  target_persona: string;
  visual_description: string;
  key_elements: string[];
  mood_and_tone: string;
  example_ad_text_alignment: string;
}

export interface PlatformImageDescription {
  platform: string;
  image_descriptions: string[];
}

export interface VisualIdentityProposal {
  overall_vision: string;
  color_palette: ColorPalette;
  ad_creative_concepts: AdCreativeConcept[];
  platform_image_descriptions: PlatformImageDescription[];
}

export interface VisualMuseOutput {
  visual_identity_proposal: VisualIdentityProposal;
  visual_inspiration_keywords: string[];
}

export interface CreativeDraft {
  wordsmith: CreativeWordsmithOutput;
  muse: VisualMuseOutput;
  style: string;
}

// --- Campaign Types ---
export interface RecommendedChannel {
  channel_name: string;
  reasoning: string;
  primary_role_in_funnel: string;
  estimated_budget_allocation: string;
  key_actionables: string[];
  expected_kpis: string[];
}

export interface LaunchPlanPhase {
  focus: string;
  tasks: string[];
}

export interface LaunchStrategy {
  overall_objective: string;
  key_metrics_for_success: string[];
  recommended_channels: RecommendedChannel[];
  high_level_launch_plan_30_days: { [key: string]: LaunchPlanPhase };
  resource_considerations: string;
  next_steps: string[];
}

export interface CampaignArchitectOutput {
  launch_campaign_strategy: LaunchStrategy;
}

// --- State & Actions ---
export type AppView = 'landing' | 'login' | 'dashboard' | 'form' | 'team' | 'workflow' | 'report';

export interface LaunchKit {
  id: string;
  productName: string;
  createdAt: string;
  state: State;
}

export interface State {
  threadId?: string;
  isAuthenticated: boolean;
  currentUser: string | null;
  currentView: AppView;
  userInput: UserInput | null;
  marketMavenOutput: MarketMavenOutput | null;
  selectedPersona: Persona | null;
  seoSageOutput: SEOStageOutput | null;
  creativeDrafts: CreativeDraft[] | null;
  draftToRefine: CreativeDraft | null;
  selectedCreativeDraft: CreativeDraft | null;
  campaignArchitectOutput: CampaignArchitectOutput | null;
  workflowStep: WorkflowStep;
  isLoading: boolean;
  loadingStatus: string;
  error: string | null;
  launchKits: LaunchKit[];
  viewingKit: LaunchKit | null;
}

export enum WorkflowStep {
  USER_INPUT,
  MARKET_ANALYSIS,
  FEEDBACK_1,
  SEO_STRATEGY,
  CREATIVE_GENERATION,
  FEEDBACK_2,
  CREATIVE_REFINEMENT,
  LAUNCH_PLAN,
  FINAL_OUTPUT,
}

export enum ActionType {
    SET_VIEW = 'SET_VIEW',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGOUT = 'LOGOUT',
    START_NEW_KIT = 'START_NEW_KIT',
    SUBMIT_FORM = 'SUBMIT_FORM',
    START_WORKFLOW = 'START_WORKFLOW',
    SET_LOADING = 'SET_LOADING',
    MARKET_ANALYSIS_SUCCESS = 'MARKET_ANALYSIS_SUCCESS',
    SET_THREAD_ID = 'SET_THREAD_ID',
    SELECT_PERSONA_AND_RUN_SEO = 'SELECT_PERSONA_AND_RUN_SEO',
    SEO_STRATEGY_SUCCESS = 'SEO_STRATEGY_SUCCESS',
    CREATIVE_GENERATION_SUCCESS = 'CREATIVE_GENERATION_SUCCESS',
    SEO_AND_CREATIVE_SUCCESS = 'SEO_AND_CREATIVE_SUCCESS',
    SELECT_CREATIVE_STYLE = 'SELECT_CREATIVE_STYLE',
    REFINE_CREATIVE_AND_RUN_PLAN = 'REFINE_CREATIVE_AND_RUN_PLAN',
    LAUNCH_PLAN_SUCCESS = 'LAUNCH_PLAN_SUCCESS',
    SET_ERROR = 'SET_ERROR',
    RESET = 'RESET',
    LOAD_KITS_SUCCESS = 'LOAD_KITS_SUCCESS',
    SAVE_KIT_SUCCESS = 'SAVE_KIT_SUCCESS',
    VIEW_KIT = 'VIEW_KIT',
}

export type Action =
    | { type: ActionType.SET_VIEW; payload: AppView }
    | { type: ActionType.LOGIN_SUCCESS; payload: { email: string; kits: LaunchKit[] } }
    | { type: ActionType.LOGOUT }
    | { type: ActionType.START_NEW_KIT }
    | { type: ActionType.SUBMIT_FORM; payload: UserInput }
    | { type: ActionType.START_WORKFLOW }
    | { type: ActionType.SET_LOADING; payload: { isLoading: boolean; status?: string } }
    | { type: ActionType.MARKET_ANALYSIS_SUCCESS; payload: MarketMavenOutput }
    | { type: ActionType.SET_THREAD_ID; payload: string }
    | { type: ActionType.SELECT_PERSONA_AND_RUN_SEO; payload: Persona }
    | { type: ActionType.SEO_STRATEGY_SUCCESS; payload: SEOStageOutput }
    | { type: ActionType.CREATIVE_GENERATION_SUCCESS; payload: CreativeDraft[] }
    | { type: ActionType.SEO_AND_CREATIVE_SUCCESS; payload: { seo: SEOStageOutput, creative: CreativeDraft[] } }
    | { type: ActionType.SELECT_CREATIVE_STYLE; payload: CreativeDraft }
    | { type: ActionType.REFINE_CREATIVE_AND_RUN_PLAN; payload: CreativeDraft }
    | { type: ActionType.LAUNCH_PLAN_SUCCESS; payload: CampaignArchitectOutput }
    | { type: ActionType.SET_ERROR; payload: string }
    | { type: ActionType.RESET }
    | { type: ActionType.LOAD_KITS_SUCCESS; payload: LaunchKit[] }
    | { type: ActionType.SAVE_KIT_SUCCESS; payload: LaunchKit[] }
    | { type: ActionType.VIEW_KIT; payload: LaunchKit };

