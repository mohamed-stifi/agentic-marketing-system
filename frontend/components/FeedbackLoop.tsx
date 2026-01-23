import React, { useState } from 'react';
import UserIcon from './icons/UserIcon';

interface FeedbackLoopProps<T> {
  propositions: T[];
  question: string;
  title: string;
  description: string;
  renderProposition: (item: T) => React.ReactNode;
  onSubmit: (selectedIndex: number) => void;
  isLoading: boolean;
}

const FeedbackLoop = <T,>({
  propositions,
  question,
  title,
  description,
  renderProposition,
  onSubmit,
  isLoading,
}: FeedbackLoopProps<T>): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit(selectedIndex);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {propositions.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer group ${
              selectedIndex === index 
                ? 'border-2 border-indigo-500 bg-white shadow-2xl shadow-indigo-500/20 transform -translate-y-2' 
                : 'border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {renderProposition(item)}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold text-center text-slate-800">{question}</h3>
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
          >
            <UserIcon className="w-5 h-5" />
            {isLoading ? 'Processing...' : 'Confirm Selection & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoop;