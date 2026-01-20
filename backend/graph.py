from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from schemas import AgentState
from agents import *

workflow = StateGraph(AgentState)

workflow.add_node("market_maven", run_market_maven)
workflow.add_node("seo_sage", run_seo_sage)
workflow.add_node("creative_team", run_creative_team)
workflow.add_node("campaign_architect", run_campaign_architect)

workflow.set_entry_point("market_maven")

# Logical flow
workflow.add_edge("market_maven", "seo_sage")
workflow.add_edge("seo_sage", "creative_team")
workflow.add_edge("creative_team", "campaign_architect")
workflow.add_edge("campaign_architect", END)

memory = MemorySaver()

# Interruption points for Human Feedback
app = workflow.compile(
    checkpointer=memory,
    interrupt_before=["seo_sage", "campaign_architect"]
)