import os
from typing import Literal
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, HumanMessage
# from langgraph.prebuilt import create_react_agent
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy

from schemas import *

load_dotenv()

# --- 1. LLM SETUP ---
model_name = "openai/gpt-oss-120b" # Or "gpt-4o" if available
llm = ChatOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    model=model_name,
    temperature=0.2
)

# --- 2. TOOLS ---
@tool
def web_search(query: str) -> str:
    """Useful for searching the internet for market data, competitor info, and trends."""
    search = DuckDuckGoSearchRun()
    return search.invoke(query)

tools = [web_search]

# --- 3. PROMPTS ---
MARKET_SYSTEM_PROMPT = """You are the Market Maven AI. 
Your goal: Analyze the product, search for real competitors and market trends, and define 3 distinct personas.
Use the web_search tool to validate your assumptions.
Finally, output the data strictly adhering to the MarketMavenOutput schema."""

SEO_SYSTEM_PROMPT = """You are the SEO Sage AI.
Your goal: Identify high-impact keywords for the specific User Persona provided.
Use web_search to find search volumes or trends if possible.
Output strictly adhering to the SEOStageOutput schema."""

CREATIVE_SYSTEM_PROMPT = """You are the Creative Team (Wordsmith & Muse).
Your goal: Generate marketing copy and visual concepts matching the requested Style.
No search needed usually, just pure creativity.

For the Visual Muse (Image Descriptions):
- You MUST generate highly detailed, standalone prompts suitable for AI image generators (like Midjourney, Stable Diffusion, Pollinations).
- Include specific details about:
  - Subject: Clear description of the main focus.
  - Lighting: e.g., "cinematic lighting", "golden hour", "soft studio lighting", "neon lights".
  - Camera/Lens: e.g., "shot on 35mm", "f/1.8 aperture", "wide angle", "macro", "4k", "8k".
  - Style/Medium: e.g., "hyper-realistic photography", "digital art", "oil painting", "minimalist vector".
  - Vibe/Atmosphere: e.g., "dreamy", "energetic", "professional", "moody".
- Example: "A futuristic sneaker floating in mid-air, neon blue and pink lighting, cyberpunk city background, hyper-realistic, 8k resolution, shot on 85mm lens."

Output strictly adhering to the defined schema."""

CAMPAIGN_SYSTEM_PROMPT = """You are the Campaign Architect.
Your goal: Synthesize the persona, SEO data, and creative assets into a 30-day launch plan.
Output strictly adhering to the CampaignArchitectOutput schema."""


def run_agent_with_structure(state_data: Any, system_prompt: str, output_schema: Any):
    """
    Generic function to run a ReAct agent that enforces a structured output.
    """
    agent = create_agent(
        llm,
        tools=[web_search],
        response_format=ProviderStrategy(output_schema)
    )
    # Run the agent
    print(f"DEBUG: Invoking agent with prompt: {str(state_data)[:100]}...") 
    response = agent.invoke({"messages": [HumanMessage(content=str(state_data))]})
    
    print(f"DEBUG: Agent Response Type: {type(response['structured_response'])}")
    print(f"DEBUG: Agent Response Content: {response['structured_response']}")
    return response["structured_response"]


def run_market_maven(state: AgentState):
    print("--- Market Maven: Researching & Structuring ---")
    try:
        output = run_agent_with_structure(
            state_data=state["user_input"],
            system_prompt=MARKET_SYSTEM_PROMPT,
            output_schema=MarketMavenOutput
        )
        return {"market_maven_output": output, "current_step": "FEEDBACK_1"}
    except Exception as e:
        print(f"Error in Market Maven: {e}")
        return {"market_maven_output": None, "current_step": "ERROR"}


def run_seo_sage(state: AgentState):
    print("--- SEO Sage: Optimizing ---")
    
    # 1. Extract Persona Name safely (Handle both Dict and Object)
    persona_data = state.get("selected_persona")
    persona_name = "General Audience"
    
    if persona_data:
        if isinstance(persona_data, dict):
            persona_name = persona_data.get("persona_name", "General Audience")
        elif hasattr(persona_data, "persona_name"):
            persona_name = persona_data.persona_name

    context = f"Product: {state['user_input']}\nTarget Persona Name: {persona_name}"

    try:
        output = run_agent_with_structure(
            state_data=context,
            system_prompt=SEO_SYSTEM_PROMPT,
            output_schema=SEOStageOutput
        )
        return {"seo_sage_output": output, "current_step": "CREATIVE_GENERATION"}
    except Exception as e:
        print(f"Error in SEO Sage: {e}")
        # Return None to avoid crashing, Frontend handles missing data
        return {"seo_sage_output": None, "current_step": "ERROR"}


def run_creative_team(state: AgentState):
    print("--- Creative Team: Designing ---")
    
    styles = ["Bold & Modern", "Professional & Trustworthy", "Playful & Engaging"]
    drafts = []
    
    # Extract Persona Name (Same logic as above)
    persona_data = state.get("selected_persona")
    persona_name = "Target Audience"
    if isinstance(persona_data, dict):
        persona_name = persona_data.get("persona_name", "Target Audience")
    elif hasattr(persona_data, "persona_name"):
        persona_name = persona_data.persona_name

    context_base = f"Product: {state['user_input']}\nPersona: {persona_name}"

    # Define a temporary Combined Schema for the agent to fill
    class CombinedCreativeOutput(BaseModel):
        wordsmith: CreativeWordsmithOutput
        muse: VisualMuseOutput

    for style in styles:
        print(f"   Generating style: {style}...")
        style_prompt = f"{CREATIVE_SYSTEM_PROMPT}\n\nTARGET STYLE: {style}"
        
        try:
            # We treat the style prompt as part of the user input context for the agent
            full_context = f"{context_base}\n\nTASK: Generate creative assets for the style '{style}'."
            
            output: CombinedCreativeOutput = run_agent_with_structure(
                state_data=full_context,
                system_prompt=style_prompt,
                output_schema=CombinedCreativeOutput
            )
            
            drafts.append(CreativeDraft(
                wordsmith=output.wordsmith,
                muse=output.muse,
                style=style
            ))
        except Exception as e:
            print(f"Error generating style {style}: {e}")
            # Continue to next style instead of crashing
            continue
    
    return {"creative_drafts": drafts, "current_step": "FEEDBACK_2"}


def run_campaign_architect(state: AgentState):
    print("--- Campaign Architect: Planning ---")
    
    # Construct a summary context string
    # We can't dump the whole state objects because they might be complex Pydantic models
    # Convert them to dicts if possible or strings
    
    seo_data = state.get("seo_sage_output")
    creative_data = state.get("selected_creative_draft")
    
    context = f"""
    Product: {state['user_input']}
    Selected Persona: {state.get('selected_persona')}
    SEO Strategy Summary: {str(seo_data)[:500]}... 
    Creative Direction: {str(creative_data)[:500]}...
    """

    try:
        output = run_agent_with_structure(
            state_data=context,
            system_prompt=CAMPAIGN_SYSTEM_PROMPT,
            output_schema=CampaignArchitectOutput
        )
        return {"campaign_architect_output": output, "current_step": "FINAL_OUTPUT"}
    except Exception as e:
        print(f"Error in Campaign Architect: {e}")
        return {"campaign_architect_output": None, "current_step": "ERROR"}