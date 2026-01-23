// --- frontend/src/App.tsx ---

import React, { useReducer } from 'react';
import {
  UserInput,
  State,
  Action,
  WorkflowStep,
  Persona,
  CreativeDraft,
  ActionType,
  LaunchKit,
} from './types';
import {
  INITIAL_STATE,
  STEP_DESCRIPTIONS,
} from './constants';
import * as api from './services/api';
import * as db from './services/dbService';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserInputForm from './components/UserInputForm';
import TeamView from './components/TeamView';
import Loader from './components/Loader';
import FeedbackLoop from './components/FeedbackLoop';
import CreativeRefinement from './components/CreativeRefinement';
import FinalOutput from './components/FinalOutput';
import BrainIcon from './components/icons/BrainIcon';

// ... (Keep WorkflowStepper and ErrorAlert components exactly as they were) ...
const WorkflowStepper: React.FC<{ currentStep: WorkflowStep }> = ({ currentStep }) => {
    const steps = Object.values(WorkflowStep).filter(v => !isNaN(Number(v))) as WorkflowStep[];
    const currentStepIndex = steps.indexOf(currentStep);

    return (
        <div className="w-full overflow-x-auto">
          <div className="max-w-5xl mx-auto my-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between min-w-max">
              <nav aria-label="Progress">
                  <ol role="list" className="flex items-center">
                      {steps.slice(1, -1).map((step, stepIdx) => { 
                          const isCompleted = (stepIdx + 1) < currentStepIndex;
                          const isActive = (stepIdx + 1) === currentStepIndex;
                          return (
                              <li key={STEP_DESCRIPTIONS[step].title} className={`relative ${stepIdx !== steps.length - 3 ? 'pr-8 sm:pr-24' : ''}`}>
                                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                      <div className={`h-1 w-full ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                  </div>
                                  <div className="relative flex flex-col items-center text-center">
                                      <p className={`text-xs w-28 font-bold ${isActive || isCompleted ? 'text-blue-600' : 'text-slate-500'}`}>{STEP_DESCRIPTIONS[step].title}</p>
                                      <p className="text-xs text-slate-500 w-28">{STEP_DESCRIPTIONS[step].description}</p>
                                  </div>
                              </li>
                          )
                      })}
                  </ol>
              </nav>
          </div>
        </div>
    );
};

const ErrorAlert: React.FC<{ error: string; onReset: () => void; }> = ({ error, onReset }) => (
  <div className="max-w-4xl mx-auto my-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-md">
    <div className="flex">
        {/* SVG Icon */}
       <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5a1 1 0 012 0v2a1 1 0 11-2 0v-2zm0-7a1 1 0 012 0v4a1 1 0 11-2 0V6z"/></svg></div>
      <div>
        <p className="font-bold">An Error Occurred</p>
        <p className="text-sm">{error}</p>
        <button onClick={onReset} className="mt-2 text-sm font-semibold text-red-900 hover:underline">Click here to start over</button>
      </div>
    </div>
  </div>
);

// --- REDUCER (Keep exactly as provided in your update) ---
const appReducer = (state: State, action: Action): State => {
  const resetWorkflowState = {
    userInput: null,
    marketMavenOutput: null,
    selectedPersona: null,
    seoSageOutput: null,
    creativeDrafts: null,
    draftToRefine: null,
    selectedCreativeDraft: null,
    campaignArchitectOutput: null,
    workflowStep: WorkflowStep.USER_INPUT,
    viewingKit: null,
    threadId: undefined,
  };

  switch (action.type) {
    case ActionType.SET_VIEW:
        return { ...state, currentView: action.payload, error: null };
    case ActionType.LOGIN_SUCCESS:
        return { ...state, isAuthenticated: true, currentUser: action.payload.email, launchKits: action.payload.kits, currentView: 'dashboard' };
    case ActionType.LOGOUT:
        return INITIAL_STATE;
    case ActionType.START_NEW_KIT:
        return { ...state, ...resetWorkflowState, currentView: 'form' };
    case ActionType.SUBMIT_FORM:
        return { ...state, userInput: action.payload, currentView: 'team', error: null };
    case ActionType.START_WORKFLOW:
      return { ...state, currentView: 'workflow', error: null }; 
    case ActionType.SET_LOADING:
      return { ...state, isLoading: action.payload.isLoading, loadingStatus: action.payload.status || state.loadingStatus };
    case ActionType.SET_THREAD_ID:
        return { ...state, threadId: action.payload };
    case ActionType.MARKET_ANALYSIS_SUCCESS:
      return { ...state, marketMavenOutput: action.payload, workflowStep: WorkflowStep.FEEDBACK_1, isLoading: false };
    case ActionType.SELECT_PERSONA_AND_RUN_SEO:
      return { ...state, selectedPersona: action.payload };
    case ActionType.SEO_AND_CREATIVE_SUCCESS:
      return { 
          ...state, 
          seoSageOutput: action.payload.seo, 
          creativeDrafts: action.payload.creative,
          workflowStep: WorkflowStep.FEEDBACK_2, 
          isLoading: false 
      };
    case ActionType.SELECT_CREATIVE_STYLE:
        return { ...state, draftToRefine: action.payload, workflowStep: WorkflowStep.CREATIVE_REFINEMENT };
    case ActionType.REFINE_CREATIVE_AND_RUN_PLAN:
        return { ...state, selectedCreativeDraft: action.payload };
    case ActionType.LAUNCH_PLAN_SUCCESS:
        return { ...state, campaignArchitectOutput: action.payload, workflowStep: WorkflowStep.FINAL_OUTPUT, isLoading: false };
    case ActionType.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionType.RESET:
      return { ...INITIAL_STATE, isAuthenticated: state.isAuthenticated, currentUser: state.currentUser, launchKits: state.launchKits, currentView: state.isAuthenticated ? 'dashboard' : 'landing' };
    case ActionType.LOAD_KITS_SUCCESS:
        return { ...state, launchKits: action.payload };
    case ActionType.SAVE_KIT_SUCCESS:
        return { ...state, launchKits: action.payload, isLoading: false };
    case ActionType.VIEW_KIT:
      return { ...state, viewingKit: action.payload, currentView: 'report' };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // --- API HANDLERS ---
  
  const handleStartWorkflow = async () => {
    if (!state.userInput) return;
    
    dispatch({ type: ActionType.SET_VIEW, payload: 'workflow' });
    dispatch({ type: ActionType.SET_LOADING, payload: { isLoading: true, status: STEP_DESCRIPTIONS[WorkflowStep.MARKET_ANALYSIS].description } });

    try {
        console.log("Calling API start...");
        const data = await api.startWorkflow(state.userInput);
        console.log("API Response:", data);
        
        if (!data.market_maven_output) {
            throw new Error("Received empty market analysis from backend.");
        }

        dispatch({ type: ActionType.SET_THREAD_ID, payload: data.thread_id });
        dispatch({ type: ActionType.MARKET_ANALYSIS_SUCCESS, payload: data.market_maven_output });
        
    } catch (err) {
        console.error(err);
        dispatch({ type: ActionType.SET_ERROR, payload: err instanceof Error ? err.message : 'Failed to start workflow.' });
    }
  };

  const handleFeedback1Submit = async (selectedIndex: number) => {
    if (!state.marketMavenOutput || !state.threadId) return;
    
    // Safety check
    const personas = state.marketMavenOutput.target_audience_personas;
    if (!personas || !personas[selectedIndex]) {
        dispatch({ type: ActionType.SET_ERROR, payload: 'Selected persona invalid.' });
        return;
    }

    const selectedPersona = personas[selectedIndex];
    
    dispatch({ type: ActionType.SELECT_PERSONA_AND_RUN_SEO, payload: selectedPersona });
    dispatch({ type: ActionType.SET_LOADING, payload: { isLoading: true, status: "Generating SEO Strategy & Creative Concepts..." } });
    
    try {
        const data = await api.submitPersonaFeedback(state.threadId, selectedPersona);
        dispatch({ 
            type: ActionType.SEO_AND_CREATIVE_SUCCESS, 
            payload: { 
                seo: data.seo_sage_output, 
                creative: data.creative_drafts 
            } 
        });
        
    } catch (err) {
        dispatch({ type: ActionType.SET_ERROR, payload: err instanceof Error ? err.message : 'Failed to generate strategy.' });
    }
  };

  const handleStyleSelection = (selectedIndex: number) => {
    if (!state.creativeDrafts) return;
    const selected = state.creativeDrafts[selectedIndex];
    dispatch({ type: ActionType.SELECT_CREATIVE_STYLE, payload: selected });
  };

  const handleCreativeRefinementSubmit = async (refinedDraft: CreativeDraft) => {
    if (!state.threadId) return;

    dispatch({ type: ActionType.REFINE_CREATIVE_AND_RUN_PLAN, payload: refinedDraft });
    dispatch({ type: ActionType.SET_LOADING, payload: { isLoading: true, status: STEP_DESCRIPTIONS[WorkflowStep.LAUNCH_PLAN].description }});

    try {
        const data = await api.submitCreativeFeedback(state.threadId, refinedDraft);
        dispatch({ type: ActionType.LAUNCH_PLAN_SUCCESS, payload: data.campaign_architect_output });
    } catch (err) {
        dispatch({ type: ActionType.SET_ERROR, payload: err instanceof Error ? err.message : 'Failed to create launch plan.' });
    }
  };

  
  // --- AUTH & UTIL HANDLERS ---
  const handleLogin = async (email: string) => {
    dispatch({ type: ActionType.SET_LOADING, payload: { isLoading: true, status: "Logging in..." } });
    const kits = await db.getLaunchKits(email);
    dispatch({ type: ActionType.LOGIN_SUCCESS, payload: { email, kits } });
    dispatch({ type: ActionType.SET_LOADING, payload: { isLoading: false } });
  };
  const handleLogout = () => { dispatch({ type: ActionType.LOGOUT }); };
  const handleFormSubmit = (data: UserInput) => { dispatch({ type: ActionType.SUBMIT_FORM, payload: data }); };
  const handleSaveKit = async () => {
    if (!state.currentUser || !state.userInput) return;
    dispatch({ type: ActionType.SET_LOADING, payload: { isLoading: true, status: 'Saving kit...' } });
    const fullState: State = { ...state, isLoading: false, error: null, loadingStatus: '' };
    const newKits = await db.saveLaunchKit(state.currentUser, fullState);
    dispatch({ type: ActionType.SAVE_KIT_SUCCESS, payload: newKits });
  };
  const handleViewKit = (kit: LaunchKit) => { dispatch({ type: ActionType.VIEW_KIT, payload: kit }); };
  const startNewKit = () => { dispatch({ type: ActionType.START_NEW_KIT }); };
  const resetApp = () => { dispatch({ type: ActionType.RESET }); }


  // --- RENDER LOGIC ---
  const renderWorkflowContent = () => {
    switch (state.workflowStep) {
      case WorkflowStep.USER_INPUT: 
        return <TeamView onStart={handleStartWorkflow} />;
      
      case WorkflowStep.MARKET_ANALYSIS:
         return <div className="p-8 text-center text-slate-500">Initializing Market Maven...</div>;

      case WorkflowStep.FEEDBACK_1:
        // FIX: Add Safe Navigation Operator (?.) to prevent White Screen of Death
        if (!state.marketMavenOutput || !state.marketMavenOutput.target_audience_personas) {
             return <div className="text-red-500 p-8">Error: Market analysis data is invalid or missing.</div>;
        }

        return (
          <FeedbackLoop<Persona>
            // FIX: Ensure slice exists
            propositions={state.marketMavenOutput.target_audience_personas?.slice(0,3) || []}
            question="Which persona best represents your ideal customer?"
            title="Validate Target Audience"
            description="The Market Maven has generated potential customer personas. Select one."
            renderProposition={(persona) => (
              <div>
                <h3 className="font-bold text-lg text-indigo-700">{persona.persona_name}</h3>
                <p className="text-sm text-slate-600 mt-1 italic">"{persona.quote}"</p>
                <p className="text-sm mt-2"><strong>Occupation:</strong> {persona.demographics?.occupation || 'N/A'}</p>
                <p className="text-sm"><strong>Pain Points:</strong> {persona.psychographics?.pain_points?.join(', ') || 'N/A'}</p>
              </div>
            )}
            onSubmit={handleFeedback1Submit}
            isLoading={state.isLoading}
          />
        );
      
      case WorkflowStep.SEO_STRATEGY:
      case WorkflowStep.CREATIVE_GENERATION:
          return <div className="p-8 text-center text-slate-500">Consulting SEO Sage & Creative Team...</div>;

       case WorkflowStep.FEEDBACK_2:
        if (!state.creativeDrafts) return <div>Error: Creative drafts missing.</div>;
        return (
            <FeedbackLoop<CreativeDraft>
                propositions={state.creativeDrafts}
                question="Which creative direction best aligns with your brand?"
                title="Review Creative Drafts"
                description="Our creative team has produced distinct creative directions. Please review and select one to proceed."
                renderProposition={(draft) => (
                    <div>
                        <h3 className="font-bold text-lg text-indigo-700">{draft.style}</h3>
                        <div className="mt-2 text-sm space-y-2">
                           <p><strong>Copy Sample:</strong> "{draft.wordsmith.content_generation.ad_copy_variations[0]?.headline_suggestions[0]}"</p>
                           <p><strong>Visual Vision:</strong> {draft.muse.visual_identity_proposal.overall_vision}</p>
                        </div>
                    </div>
                )}
                onSubmit={handleStyleSelection}
                isLoading={state.isLoading}
            />
        );
      case WorkflowStep.CREATIVE_REFINEMENT:
        if (!state.draftToRefine) return <div>Error: No creative draft selected for refinement.</div>;
        return <CreativeRefinement draft={state.draftToRefine} onSubmit={handleCreativeRefinementSubmit} isLoading={state.isLoading} />;
      case WorkflowStep.FINAL_OUTPUT:
          // --- FIX START ---
          if (!state.campaignArchitectOutput) {
              return (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                          <p className="font-bold">Generation Failed</p>
                          <p className="text-sm">The Campaign Architect could not generate the final plan.</p>
                      </div>
                      <button 
                          onClick={() => window.location.reload()} 
                          className="text-blue-600 underline"
                      >
                          Reload and try again
                      </button>
                  </div>
              );
          }
          // --- FIX END ---
          return <FinalOutput state={state} onSave={state.isAuthenticated ? handleSaveKit : undefined} />;
      default:
        return null;
    }
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
        case 'landing': return <LandingPage onStart={startNewKit} />;
        case 'login': return <Login onLogin={handleLogin} isLoading={state.isLoading} />;
        case 'dashboard': return <Dashboard kits={state.launchKits} onNew={startNewKit} onView={handleViewKit} />;
        case 'form': return <UserInputForm onSubmit={handleFormSubmit} isLoading={state.isLoading} />;
        case 'team': return <TeamView onStart={handleStartWorkflow} />;
        case 'workflow': return renderWorkflowContent();
        case 'report': return state.viewingKit ? <FinalOutput state={state.viewingKit.state} isViewing /> : <div>Error</div>;
        default: return <LandingPage onStart={startNewKit} />;
    }
  }
  
  const AppHeader = () => {
    const goToHome = () => dispatch({ type: ActionType.SET_VIEW, payload: state.isAuthenticated ? 'dashboard' : 'landing' });

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                 <button onClick={goToHome} className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <BrainIcon className="w-7 h-7 text-blue-600"/>
                    <span className="hidden sm:inline">Souqra</span>
                </button>
                {state.isAuthenticated ? (
                     <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 hidden sm:block">{state.currentUser}</span>
                        <button onClick={() => dispatch({ type: ActionType.SET_VIEW, payload: 'dashboard' })} className="text-sm font-semibold text-slate-600 hover:text-blue-600">Dashboard</button>
                        <button onClick={handleLogout} className="text-sm font-semibold text-slate-600 hover:text-blue-600">Logout</button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => dispatch({ type: ActionType.SET_VIEW, payload: 'login' })} className="text-sm font-semibold text-slate-600 hover:text-blue-600">Login</button>
                        <button onClick={() => dispatch({ type: ActionType.SET_VIEW, payload: 'login' })} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Sign Up</button>
                    </div>
                )}
            </div>
      </header>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {state.isLoading && <Loader status={state.loadingStatus} />}
      {state.currentView !== 'login' && <AppHeader />}
      <main className="flex-grow">
        {state.currentView === 'workflow' && state.workflowStep < WorkflowStep.FINAL_OUTPUT && (
             <WorkflowStepper currentStep={state.workflowStep} />
        )}
        {state.error ? <ErrorAlert error={state.error} onReset={resetApp} /> : renderCurrentView()}
      </main>
    </div>
  );
};

export default App;