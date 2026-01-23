import React from 'react';
import { LaunchKit } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface DashboardProps {
    kits: LaunchKit[];
    onNew: () => void;
    onView: (kit: LaunchKit) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ kits, onNew, onView }) => {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-3xl font-bold leading-7 text-slate-900 sm:truncate sm:text-4xl sm:tracking-tight">
                        My Launch Kits
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        type="button"
                        onClick={onNew}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <SparklesIcon className="w-5 h-5"/>
                        Create New Kit
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {kits.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-slate-900">No launch kits yet</h3>
                        <p className="mt-1 text-sm text-slate-500">Get started by creating a new marketing kit.</p>
                        <div className="mt-6">
                             <button
                                type="button"
                                onClick={onNew}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                <SparklesIcon className="w-5 h-5"/>
                                Create New Kit
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {kits.map((kit) => (
                            <li key={kit.id} className="col-span-1 divide-y divide-slate-200 rounded-2xl bg-white shadow-lg border border-slate-200">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-lg font-bold text-slate-900">{kit.productName}</h3>
                                        </div>
                                        <p className="mt-1 truncate text-sm text-slate-500">Created on {new Date(kit.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="-mt-px flex divide-x divide-slate-200">
                                        <div className="flex w-0 flex-1">
                                            <button
                                                onClick={() => onView(kit)}
                                                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-2xl border border-transparent py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                            >
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                View Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
