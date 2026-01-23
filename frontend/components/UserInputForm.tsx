import React, { useState } from 'react';
import { UserInput } from '../types';
import { INITIAL_USER_INPUT } from '../constants';

interface UserInputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['Product Info', 'Business', 'Market'];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((name, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <li key={name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {index !== steps.length - 1 && (
                <div className="absolute inset-0 top-4 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${isCompleted ? 'bg-blue-600' : 'bg-slate-300'}`} />
                </div>
              )}
              
              <div className="relative flex flex-col items-center space-y-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    isCompleted ? 'bg-blue-600 text-white' : isActive ? 'border-2 border-blue-600 bg-white text-blue-600' : 'border-2 border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{name}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


const FormCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0">{icon}</div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const InputField: React.FC<{
  id: keyof UserInput;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
  required?: boolean;
}> = ({ id, label, placeholder, value, onChange, isTextarea = false, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextarea ? (
      <textarea
        id={id}
        name={id}
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full rounded-lg border-slate-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out placeholder:text-slate-400"
      />
    ) : (
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full rounded-lg border-slate-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out placeholder:text-slate-400"
      />
    )}
  </div>
);

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>(INITIAL_USER_INPUT);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
        if (!formData.productName || !formData.productDescription || !formData.usp) {
            alert("Please fill in all required fields.");
            return;
        }
    }
    if (step === 2) {
        if (!formData.brandVoice) {
             alert("Please fill in all required fields.");
            return;
        }
    }
    setStep(s => s + 1);
  };
  
  const handlePrevious = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (step === 3) {
        if (!formData.launchObjective) {
             alert("Please fill in all required fields.");
            return;
        }
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Product Launch Brief
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Tell us about your product and we'll create a comprehensive marketing strategy.
            </p>
        </div>

        <div className="mb-10">
            <Stepper currentStep={step} />
        </div>

        <form onSubmit={handleSubmit}>
            <div className="space-y-8 min-h-[380px]">
              {step === 1 && (
                  <FormCard 
                      title="Product Information" 
                      icon={<div className="bg-blue-100 text-blue-600 rounded-lg p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></div>}
                  >
                      <InputField id="productName" label="Product Name" placeholder="e.g., EcoBottle - Smart Water Bottle" value={formData.productName} onChange={handleChange} required />
                      <InputField id="productDescription" label="Product Description" placeholder="Describe your product in detail..." value={formData.productDescription} onChange={handleChange} isTextarea required />
                      <InputField id="usp" label="Unique Selling Proposition (USP)" placeholder="What makes your product unique?" value={formData.usp} onChange={handleChange} isTextarea required />
                  </FormCard>
              )}

              {step === 2 && (
                  <FormCard 
                      title="Business Context" 
                      icon={<div className="bg-green-100 text-green-600 rounded-lg p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>}
                  >
                      <InputField id="brandVoice" label="Desired Brand Voice/Tone" placeholder="e.g., Professional yet approachable, eco-conscious, innovative..." value={formData.brandVoice} onChange={handleChange} required />
                      <InputField id="targetLocation" label="Target Market Location" placeholder="e.g., Urban areas in North America and Western Europe" value={formData.targetLocation} onChange={handleChange} />
                  </FormCard>
              )}

              {step === 3 && (
                  <FormCard 
                      title="Market & Goals" 
                      icon={<div className="bg-purple-100 text-purple-600 rounded-lg p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>}
                  >
                      <InputField id="competitors" label="Known Competitors" placeholder="e.g., HidrateSpark, LARQ, generic reusable bottles like Hydro Flask..." value={formData.competitors} onChange={handleChange} isTextarea />
                      <InputField id="launchObjective" label="Primary Launch Objective" placeholder="e.g., Generate first 1,000 sales and build an initial email list of 5,000 subscribers" value={formData.launchObjective} onChange={handleChange} required />
                      <InputField id="customerHypothesis" label="Ideal Customer Hypothesis" placeholder="e.g., Tech-savvy millennials and Gen Z individuals who are health-conscious..." value={formData.customerHypothesis} onChange={handleChange} isTextarea />
                  </FormCard>
              )}
            </div>

            <div className="mt-8 pt-4 flex justify-between items-center">
                <div>
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex justify-center items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-300"
                        >
                            Previous
                        </button>
                    )}
                </div>
                <div>
                    {step < 3 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
                        >
                            Next Step
                        </button>
                    )}
                    {step === 3 && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center items-center gap-2.5 rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? 'Generating...' : 'Generate Strategy'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </form>
    </div>
  );
};

export default UserInputForm;