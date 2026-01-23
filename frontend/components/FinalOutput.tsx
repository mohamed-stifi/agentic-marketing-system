import React, { useState } from 'react';
import { State, Persona, Keyword, RecommendedChannel, LaunchPlanPhase } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import DownloadIcon from './icons/DownloadIcon';
import SparklesIcon from './icons/SparklesIcon';

const GroundingSources: React.FC<{ metadata: any }> = ({ metadata }) => {
    if (!metadata?.groundingChunks || metadata.groundingChunks.length === 0) {
        return null;
    }

    const sources = metadata.groundingChunks
        .map((chunk: any) => chunk.web)
        .filter(Boolean);

    if (sources.length === 0) return null;

    return (
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <h4 className="font-semibold text-slate-800 text-base">Research Sources:</h4>
            <ul className="list-decimal list-inside text-sm text-slate-600 space-y-1.5 mt-2">
                {sources.map((source: any, index: number) => (
                    <li key={index}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                            {source.title || source.uri}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const ReportSection: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen=false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-lg mb-6 overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-slate-800 hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-5 border-t border-slate-200 bg-slate-50/50">{children}</div>}
    </div>
  );
};

const ExecutiveSummarySection: React.FC<{ state: State }> = ({ state }) => {
    const { campaignArchitectOutput, userInput } = state;
    // Defensive check
    if (!campaignArchitectOutput || !campaignArchitectOutput.launch_campaign_strategy || !userInput) return null;

    const strategy = campaignArchitectOutput.launch_campaign_strategy;

    return (
        <ReportSection title="Executive Summary & Launch Plan" defaultOpen={true}>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Launch Objective: <span className="text-indigo-600">{strategy.overall_objective || "N/A"}</span></h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-slate-700 text-lg">Key Metrics for Success:</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1.5 mt-2 pl-2">
                        {strategy.key_metrics_for_success?.map((metric, i) => <li key={i}>{metric}</li>) || <li>No metrics defined.</li>}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 text-lg">Recommended Channels:</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {strategy.recommended_channels?.map((channel: RecommendedChannel, i: number) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h5 className="font-bold text-indigo-700">{channel.channel_name}</h5>
                                <p className="text-sm text-slate-500 mt-1">{channel.reasoning}</p>
                                <div className="mt-2 text-xs font-semibold uppercase text-slate-400 tracking-wider">{channel.primary_role_in_funnel}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 text-lg">30-Day Launch Plan:</h4>
                    <div className="space-y-3 mt-3">
                        {/* SAFE OBJECT ENTRIES: Fallback to empty object if null */}
                        {Object.entries(strategy.high_level_launch_plan_30_days || {}).map(([phase, phaseData]: [string, LaunchPlanPhase]) => (
                            <div key={phase} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="font-bold text-sm uppercase text-indigo-600 tracking-wider">{phase.replace(/_/g, ' ')}</p>
                                <p className="font-semibold text-slate-800 mt-1">{phaseData.focus}</p>
                                <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1 pl-2">
                                    {/* SAFE MAP: Fallback to empty array */}
                                    {phaseData.tasks?.map((task, i) => <li key={i}>{task}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ReportSection>
    );
};

const AudienceReportSection: React.FC<{ state: State }> = ({ state }) => {
    const { marketMavenOutput } = state;
    if (!marketMavenOutput) return null;

    const PersonaCard: React.FC<{ persona: Persona }> = ({ persona }) => (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h4 className="font-bold text-xl text-indigo-700">{persona.persona_name}</h4>
            <p className="text-sm text-slate-500 italic mt-1.5">"{persona.quote}"</p>
            <div className="mt-4 text-sm space-y-2 text-slate-600">
                <p><strong>Age:</strong> {persona.demographics?.age_range}</p>
                <p><strong>Occupation:</strong> {persona.demographics?.occupation}</p>
                <p><strong>Pain Points:</strong> {persona.psychographics?.pain_points?.slice(0,3).join(', ')}</p>
            </div>
        </div>
    );

    return (
        <ReportSection title="Target Audience & Competitors">
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Target Audience Personas</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketMavenOutput.target_audience_personas?.map(p => <PersonaCard key={p.persona_name} persona={p}/>)}
            </div>
             <h3 className="text-2xl font-bold mt-8 mb-3 text-slate-900">Competitor Summary</h3>
             {/* Handle Generic Dict or Specific Object for Competitors */}
             <p className="text-slate-600 mb-4">{
                typeof marketMavenOutput.competitor_summary?.overview === 'string' 
                ? marketMavenOutput.competitor_summary.overview 
                : "Competitor analysis below."
             }</p>
             
             <div className="space-y-4">
                 {/* Logic to render generic dictionary if strict schema isn't matched exactly */}
                 {marketMavenOutput.competitor_summary?.key_competitors 
                    ? marketMavenOutput.competitor_summary.key_competitors.map((c: any) => (
                        <div key={c.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-lg text-indigo-700">{c.name}</h4>
                            <p className="text-sm text-slate-600 mt-1"><strong>Strengths:</strong> {c.strengths?.join(', ')}</p>
                            <p className="text-sm text-slate-600"><strong>Weaknesses:</strong> {c.weaknesses?.join(', ')}</p>
                        </div>
                    ))
                    : <div className="text-sm text-slate-500">
                        {/* Fallback for generic dict output */}
                        {Object.entries(marketMavenOutput.competitor_summary || {}).map(([k, v]: [string, any]) => {
                            if(k === 'overview') return null;
                            return (
                                <div key={k} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-2">
                                    <h4 className="font-bold text-lg text-indigo-700">{k}</h4>
                                    <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans">{JSON.stringify(v, null, 2)}</pre>
                                </div>
                            )
                        })}
                      </div>
                 }
             </div>
             <GroundingSources metadata={(marketMavenOutput as any)?.groundingMetadata} />
        </ReportSection>
    );
};

const SeoFoundationSection: React.FC<{ state: State }> = ({ state }) => {
    const { seoSageOutput } = state;
    if (!seoSageOutput) return null;
    
    const KeywordsDisplay: React.FC<{ title: string, keywords: Keyword[]}> = ({ title, keywords }) => {
        if (!keywords || keywords.length === 0) return null;
        return (
            <div>
                <h4 className="font-semibold text-slate-700 text-lg mt-4 mb-2">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((k, idx) => <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">{k.keyword}</span>)}
                </div>
            </div>
        );
    }

    return (
        <ReportSection title="SEO Foundation">
             <h3 className="text-2xl font-bold mb-2 text-slate-900">Keyword Strategy</h3>
             <p className="text-slate-600 mb-4">{seoSageOutput.keyword_research?.overview}</p>
             <KeywordsDisplay title="Informational Keywords" keywords={seoSageOutput.keyword_research?.categorized_keywords?.informational_keywords} />
             <KeywordsDisplay title="Commercial Keywords" keywords={seoSageOutput.keyword_research?.categorized_keywords?.commercial_investigation_keywords} />
             <KeywordsDisplay title="Transactional Keywords" keywords={seoSageOutput.keyword_research?.categorized_keywords?.transactional_keywords} />
             <GroundingSources metadata={(seoSageOutput as any)?.groundingMetadata} />
        </ReportSection>
    );
};

const CreativeAssetsSection: React.FC<{ state: State }> = ({ state }) => {
    const { selectedCreativeDraft } = state;
    if (!selectedCreativeDraft) return null;

    const { wordsmith, muse } = selectedCreativeDraft;

    return (
        <>
            <ReportSection title="Creative Assets: Copy">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Ready-to-Use Copy ({selectedCreativeDraft.style} Style)</h3>
                <div className="space-y-4">
                    {wordsmith.content_generation?.product_descriptions?.map((desc, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-semibold text-indigo-700">Product Description ({desc.description_type})</h4>
                            <p className="text-sm text-slate-600 mt-1">{desc.copy}</p>
                        </div>
                    ))}
                    {wordsmith.content_generation?.ad_copy_variations?.map((ad, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-semibold text-indigo-700">Ad Copy ({ad.ad_platform})</h4>
                             <p className="text-sm text-slate-600 mt-1"><strong>Headline:</strong> {ad.headline_suggestions?.[0]}</p>
                             <p className="text-sm text-slate-600"><strong>Description:</strong> {ad.description_suggestions?.[0]}</p>
                        </div>
                    ))}
                </div>
            </ReportSection>

            <ReportSection title="Creative Assets: Visuals">
                 <h3 className="text-2xl font-bold mb-2 text-slate-900">Visual Identity Proposal ({selectedCreativeDraft.style} Style)</h3>
                 <p className="text-slate-600 mb-4">{muse.visual_identity_proposal?.overall_vision}</p>
                 
                 {muse.visual_identity_proposal?.color_palette && (
                     <div className="mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-semibold text-slate-700 text-lg">Color Palette</h4>
                        <div className="flex gap-3 mt-3 items-center flex-wrap">
                            {muse.visual_identity_proposal.color_palette.primary_colors?.map(c => <div key={c.hex_code} className="w-12 h-12 rounded-full border-2 border-white shadow-md" style={{backgroundColor: c.hex_code}} title={`${c.name} (Primary)`}></div>)}
                            {muse.visual_identity_proposal.color_palette.secondary_colors?.map(c => <div key={c.hex_code} className="w-12 h-12 rounded-full border-2 border-white shadow-md" style={{backgroundColor: c.hex_code}} title={`${c.name} (Secondary)`}></div>)}
                            {muse.visual_identity_proposal.color_palette.accent_colors?.map(c => <div key={c.hex_code} className="w-12 h-12 rounded-full border-2 border-white shadow-md" style={{backgroundColor: c.hex_code}} title={`${c.name} (Accent)`}></div>)}
                        </div>
                     </div>
                 )}

                 <div className="space-y-4">
                     {muse.visual_identity_proposal?.ad_creative_concepts?.map((concept, i) => (
                         <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="font-semibold text-lg text-indigo-700">Ad Concept: {concept.concept_name}</h4>
                             <p className="text-sm text-slate-600 mt-1">{concept.visual_description}</p>
                         </div>
                     ))}
                 </div>
            </ReportSection>
        </>
    );
};


const FinalOutput: React.FC<{ state: State, onSave?: () => void, isViewing?: boolean }> = ({ state, onSave, isViewing = false }) => {
    const [isSaved, setIsSaved] = useState(false);

    // Initial Loading/Error State Handling
    if (!state.userInput) return <div className="text-center p-8">Loading context...</div>;
    
    // Critical: If the Campaign Architect failed to produce data, show a friendly error instead of crashing
    if (!state.campaignArchitectOutput || !state.campaignArchitectOutput.launch_campaign_strategy) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-sm">
                    <div className="inline-block p-3 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Strategy Generation Incomplete</h3>
                    <p className="text-slate-600 mb-6">
                        The AI Architect had a little trouble finalizing the complete launch plan document. 
                        However, your market analysis, SEO strategy, and creative assets are saved.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Refresh to try generating again
                    </button>
                </div>
                
                {/* Still show what we have */}
                <div className="mt-12 text-left opacity-75">
                    <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Available Assets</h4>
                    <AudienceReportSection state={state} />
                    <SeoFoundationSection state={state} />
                    <CreativeAssetsSection state={state} />
                </div>
            </div>
        );
    }
    
    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `souqra_marketing_kit_${state.userInput?.productName.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleSave = () => {
      if (onSave) {
        onSave();
        setIsSaved(true);
      }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8 animate-fade-in">
            <div className="text-center mb-10 bg-white rounded-2xl shadow-xl border border-slate-200 py-10 px-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <SparklesIcon className="w-10 h-10 text-indigo-600"/>
                  </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Your Marketing Launch Kit
                </h1>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    A comprehensive, AI-generated strategy for launching <strong>{state.userInput.productName}</strong>.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    {!isViewing && onSave && (
                        <button
                          onClick={handleSave}
                          disabled={isSaved}
                          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-green-500/40 hover:scale-[1.02] focus-visible:outline disabled:bg-green-300 disabled:scale-100 disabled:shadow-none transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H5.5z" /><path d="M9 13.5a1 1 0 011 1v1.5a1 1 0 11-2 0V14.5a1 1 0 011-1z" /></svg>
                          {isSaved ? 'Saved!' : 'Save Kit to Dashboard'}
                        </button>
                    )}
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
                    >
                      <DownloadIcon className="w-5 h-5" />
                      Download Full Kit (JSON)
                    </button>
                </div>
            </div>

            <ExecutiveSummarySection state={state} />
            <AudienceReportSection state={state} />
            <SeoFoundationSection state={state} />
            <CreativeAssetsSection state={state} />
        </div>
    );
};

export default FinalOutput;