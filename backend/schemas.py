from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from typing_extensions import TypedDict

# --- INPUT TYPES ---
class UserInput(TypedDict):
    productName: str
    productDescription: str
    usp: str
    brandVoice: str
    targetLocation: str
    competitors: str
    launchObjective: str
    customerHypothesis: str

# ==========================================
# 1. MARKET MAVEN SCHEMAS
# ==========================================
class Demographics(BaseModel):
    age_range: str
    gender_identity: str
    location: str
    income_level: str
    occupation: str

class Psychographics(BaseModel):
    interests: List[str]
    values: List[str]
    pain_points: List[str]
    goals: List[str]
    online_behavior: str

class MarketingInsights(BaseModel):
    preferred_channels: List[str]
    messaging_style: str
    call_to_action_preference: str

class Persona(BaseModel):
    persona_name: str
    demographics: Demographics
    psychographics: Psychographics
    marketing_insights: MarketingInsights
    quote: str

class Competitor(BaseModel):
    name: str
    strengths: List[str]
    weaknesses: List[str]

class MarketMavenOutput(BaseModel):
    target_audience_personas: List[Persona]
    competitor_summary: Dict[str, Any] # Keeping generic for flexibility here is okay
    research_sources: List[str]

# ==========================================
# 2. SEO SAGE SCHEMAS
# ==========================================
class Keyword(BaseModel):
    keyword: str
    search_intent: str
    relevance_to_persona: str
    content_ideas: List[str]

class CategorizedKeywords(BaseModel):
    informational_keywords: List[Keyword]
    commercial_investigation_keywords: List[Keyword]
    transactional_keywords: List[Keyword]
    long_tail_keywords: List[Keyword]

class KeywordResearch(BaseModel):
    overview: str
    categorized_keywords: CategorizedKeywords
    search_trends_and_opportunities: Dict[str, List[str]]

class OnPageOptimization(BaseModel):
    recommendation: str
    target_content_type: str

class SeoContentRecommendations(BaseModel):
    general_guidelines: List[str]
    on_page_optimization: List[OnPageOptimization]
    content_refinement_suggestions: List[OnPageOptimization]

class SEOStageOutput(BaseModel):
    keyword_research: KeywordResearch
    seo_content_recommendations: SeoContentRecommendations
    research_sources: List[str]

# ==========================================
# 3. CREATIVE TEAM SCHEMAS
# ==========================================
class ProductDescription(BaseModel):
    description_type: str
    target_persona: str
    word_count_target: str
    copy: str
    seo_keywords_integrated: List[str]
    call_to_action: str

class AdCopy(BaseModel):
    ad_platform: str
    target_persona: str
    ad_goal: str
    headline_suggestions: List[str]
    description_suggestions: List[str]
    call_to_action_options: List[str]
    seo_keywords_integrated: List[str]
    notes: str

class SocialMediaPost(BaseModel):
    platform: str
    captions: List[str]
    hashtags_suggested: List[str]
    call_to_action: str

class EmailTemplate(BaseModel):
    email_type: str
    target_persona: str
    subject_line_suggestions: List[str]
    preview_text_suggestion: str
    body_copy: str
    call_to_action: str

class ContentGeneration(BaseModel):
    product_descriptions: List[ProductDescription]
    ad_copy_variations: List[AdCopy]
    social_media_posts: List[SocialMediaPost]
    email_templates: List[EmailTemplate]

class CreativeWordsmithOutput(BaseModel):
    content_generation: ContentGeneration

# --- Visual Muse ---
class ColorDefinition(BaseModel):
    name: str
    hex_code: str
    mood_association: str
    usage_context: str

class ColorPalette(BaseModel):
    primary_colors: List[ColorDefinition]
    secondary_colors: List[ColorDefinition]
    accent_colors: List[ColorDefinition]
    color_usage_notes: str

class AdCreativeConcept(BaseModel):
    concept_name: str
    target_persona: str
    visual_description: str
    key_elements: List[str]
    mood_and_tone: str
    example_ad_text_alignment: str

class PlatformImageDescription(BaseModel):
    platform: str
    image_descriptions: List[str]

class VisualIdentityProposal(BaseModel):
    overall_vision: str
    color_palette: ColorPalette
    ad_creative_concepts: List[AdCreativeConcept]
    platform_image_descriptions: List[PlatformImageDescription]

class VisualMuseOutput(BaseModel):
    visual_identity_proposal: VisualIdentityProposal
    visual_inspiration_keywords: List[str]

# Wrapper for state
class CreativeDraft(BaseModel):
    wordsmith: CreativeWordsmithOutput
    muse: VisualMuseOutput
    style: str

# ==========================================
# 4. CAMPAIGN ARCHITECT SCHEMAS
# ==========================================
class RecommendedChannel(BaseModel):
    channel_name: str
    reasoning: str
    primary_role_in_funnel: str
    estimated_budget_allocation: str
    key_actionables: List[str]
    expected_kpis: List[str]

class LaunchPlanPhase(BaseModel):
    focus: str
    tasks: List[str]

class LaunchStrategy(BaseModel):
    overall_objective: str
    key_metrics_for_success: List[str]
    recommended_channels: List[RecommendedChannel]
    # Using strict dict for phases to allow flexibility in naming (Phase 1, Week 1, etc)
    high_level_launch_plan_30_days: Dict[str, LaunchPlanPhase] 
    resource_considerations: str
    next_steps: List[str]

class CampaignArchitectOutput(BaseModel):
    launch_campaign_strategy: LaunchStrategy

# ==========================================
# STATE MANAGEMENT
# ==========================================
class AgentState(TypedDict):
    user_input: UserInput
    thread_id: str
    market_maven_output: Optional[MarketMavenOutput]
    selected_persona: Optional[Persona]
    seo_sage_output: Optional[SEOStageOutput]
    creative_drafts: Optional[List[CreativeDraft]]
    selected_creative_draft: Optional[CreativeDraft]
    campaign_architect_output: Optional[CampaignArchitectOutput]
    current_step: str
