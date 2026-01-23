import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 lg:w-full lg:max-w-2xl">
          <svg
            className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,0 90,0 50,100 0,100" />
          </svg>

          <div className="relative px-6 py-20 sm:py-32 lg:px-8 lg:py-56 lg:pr-0">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Souqra Marketing Strategist
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Generate a comprehensive, AI-powered marketing launch kit for your product in minutes. Go from idea to actionable strategy with our team of specialized AI agents.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button
                  onClick={onStart}
                  className="inline-flex items-center gap-2.5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Create a Kit for Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
          alt="Marketing team collaborating"
        />
      </div>
    </div>
  );
};

export default LandingPage;
