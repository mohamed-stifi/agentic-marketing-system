from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from graph import app as graph_app
from schemas import UserInput, Persona, CreativeDraft
from typing import Any
app = FastAPI(title="Souqra API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartRequest(BaseModel):
    user_input: UserInput

class FeedbackRequest(BaseModel):
    thread_id: str
    selected_data: Any # Generic to handle Persona or CreativeDraft

@app.post("/start")
async def start_workflow(req: StartRequest):
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    # Start the graph
    initial_state = {"user_input": req.user_input, "thread_id": thread_id}
    
    # Run until first interruption (Market Analysis done, waiting for SEO)
    for event in graph_app.stream(initial_state, config=config):
        pass # Stream execution
    
    # Fetch state
    state = graph_app.get_state(config).values
    return {
        "thread_id": thread_id,
        "market_maven_output": state.get("market_maven_output"),
        "current_step": "FEEDBACK_1"
    }

@app.post("/feedback/persona")
async def submit_persona_feedback(req: FeedbackRequest):
    """Resume graph after Persona selection"""
    config = {"configurable": {"thread_id": req.thread_id}}
    
    # Update state with selection
    graph_app.update_state(config, {"selected_persona": req.selected_data})
    
    # Resume execution (Runs SEO -> Creative -> Stops before Architect)
    for event in graph_app.stream(None, config=config):
        pass
        
    state = graph_app.get_state(config).values
    return {
        "seo_sage_output": state.get("seo_sage_output"),
        "creative_drafts": state.get("creative_drafts"),
        "current_step": "FEEDBACK_2"
    }

@app.post("/feedback/creative")
async def submit_creative_feedback(req: FeedbackRequest):
    """Resume graph after Creative selection"""
    config = {"configurable": {"thread_id": req.thread_id}}
    
    # Update state
    graph_app.update_state(config, {"selected_creative_draft": req.selected_data})
    
    # Resume execution (Runs Architect -> End)
    for event in graph_app.stream(None, config=config):
        pass
        
    state = graph_app.get_state(config).values
    return {
        "campaign_architect_output": state.get("campaign_architect_output"),
        "current_step": "FINAL_OUTPUT"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)