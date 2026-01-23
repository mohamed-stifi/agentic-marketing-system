import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const AgentCard: React.FC<{
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = ({ name, role, description, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md h-full">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className={`rounded-lg p-2 ${color}`}>
            {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{name}</h3>
          <p className="text-sm font-semibold text-slate-500">{role}</p>
        </div>
      </div>
      <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">Ready</span>
    </div>
    <p className="mt-4 text-sm text-slate-600">{description}</p>
  </div>
);

const TeamView: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    AI Marketing Team
                </h1>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                    Your specialized AI agents working together to create your marketing strategy.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <AgentCard 
                    name="Market Maven" 
                    role="Market Research Analyst" 
                    description="Analyzes markets, researches competitors, and defines target audience personas."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
                    color="bg-blue-100"
                />
                 <AgentCard 
                    name="SEO Sage" 
                    role="SEO Specialist" 
                    description="Performs keyword research and identifies SEO opportunities."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    color="bg-green-100"
                />
                 <AgentCard 
                    name="Creative Wordsmith" 
                    role="Copywriter & Content Strategist" 
                    description="Generates compelling copy, product descriptions, and content."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                    color="bg-pink-100"
                />
                 <AgentCard 
                    name="Visual Muse" 
                    role="Art Director" 
                    description="Suggests visual identity, brand concepts, and creative direction."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    color="bg-purple-100"
                />
                 <AgentCard 
                    name="Campaign Architect" 
                    role="Digital Marketing Strategist" 
                    description="Synthesizes insights to recommend channels and a launch plan."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    color="bg-red-100"
                />
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Ready to Launch?</h3>
                    <p className="text-slate-600 mt-1">Start the workflow to generate your marketing launch kit.</p>
                </div>
                <button
                    onClick={onStart}
                    className="w-full sm:w-auto flex-shrink-0 inline-flex justify-center items-center gap-2.5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Start Workflow
                </button>
            </div>
        </div>
    );
};

export default TeamView;