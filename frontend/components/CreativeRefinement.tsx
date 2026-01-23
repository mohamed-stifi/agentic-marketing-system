import React, { useState, useCallback } from 'react';
import { CreativeDraft, EmailTemplate } from '../types';
import { generateImage } from '../services/pollinationsService';
import SparklesIcon from './icons/SparklesIcon';

interface CreativeRefinementProps {
    draft: CreativeDraft;
    onSubmit: (refinedDraft: CreativeDraft) => void;
    isLoading: boolean;
}

type Selections = {
    [platform: string]: {
        captionIndex: number;
        imageIndex: number;
    }
};

type ImageState = {
    [platform: string]: {
        url?: string;
        isGenerating?: boolean;
        error?: string;
    }
}

const CreativeRefinement: React.FC<CreativeRefinementProps> = ({ draft, onSubmit, isLoading }) => {
    const platforms = draft.wordsmith.content_generation.social_media_posts.map(p => p.platform);

    const initialSelections = platforms.reduce((acc, platform) => {
        acc[platform] = { captionIndex: 0, imageIndex: 0 };
        return acc;
    }, {} as Selections);

    const [selections, setSelections] = useState<Selections>(initialSelections);
    const [images, setImages] = useState<ImageState>({});
    const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);

    const handleSelectionChange = (platform: string, type: 'caption' | 'image', index: number) => {
        setSelections(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [`${type}Index`]: index
            }
        }));
    };

    const handleEmailSelection = (index: number) => {
        setSelectedEmailIndex(index);
    };

    const handleImageGeneration = useCallback(async (platform: string) => {
        const imageDescriptions = draft.muse.visual_identity_proposal.platform_image_descriptions.find(p => p.platform === platform);
        if (!imageDescriptions) return;

        const selectedImageIndex = selections[platform].imageIndex;
        const description = imageDescriptions.image_descriptions[selectedImageIndex];

        setImages(prev => ({ ...prev, [platform]: { isGenerating: true, error: undefined, url: prev[platform]?.url } }));
        try {
            const imageUrl = await generateImage(description);
            setImages(prev => ({ ...prev, [platform]: { url: imageUrl, isGenerating: false } }));
        } catch (error) {
            setImages(prev => ({ ...prev, [platform]: { error: 'Failed to generate image.', isGenerating: false } }));
        }
    }, [draft, selections]);

    const handleSubmit = () => {
        const refinedDraft = JSON.parse(JSON.stringify(draft)); // Deep copy

        platforms.forEach(platform => {
            const post = refinedDraft.wordsmith.content_generation.social_media_posts.find((p: any) => p.platform === platform);
            if (post) {
                post.captions = [post.captions[selections[platform].captionIndex]];
            }

            const imageSet = refinedDraft.muse.visual_identity_proposal.platform_image_descriptions.find((p: any) => p.platform === platform);
            if (imageSet) {
                imageSet.image_descriptions = [imageSet.image_descriptions[selections[platform].imageIndex]];
            }
        });

        refinedDraft.wordsmith.content_generation.email_templates = [
            refinedDraft.wordsmith.content_generation.email_templates[selectedEmailIndex]
        ];

        onSubmit(refinedDraft);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Refine Your Creative Assets</h2>
                <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
                    Select the best captions and visuals for your campaign based on the <span className="font-bold text-indigo-600">{draft.style}</span> direction.
                </p>
            </div>

            <div className="space-y-8">
                {platforms.map(platform => {
                    const post = draft.wordsmith.content_generation.social_media_posts.find(p => p.platform === platform);
                    const imageSet = draft.muse.visual_identity_proposal.platform_image_descriptions.find(p => p.platform === platform);
                    if (!post || !imageSet) return null;

                    const imageState = images[platform] || {};

                    return (
                        <div key={platform} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">{platform}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Caption Selection */}
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-3">Choose a post caption:</h4>
                                    <div className="space-y-3">
                                        {post.captions.map((caption, index) => (
                                            <label key={index} className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${selections[platform].captionIndex === index ? 'bg-blue-50 border-blue-500 shadow' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}>
                                                <input
                                                    type="radio"
                                                    name={`${platform}-caption`}
                                                    checked={selections[platform].captionIndex === index}
                                                    onChange={() => handleSelectionChange(platform, 'caption', index)}
                                                    className="sr-only"
                                                />
                                                <p className="text-sm text-slate-700">{caption}</p>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Selection & Generation */}
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-3">Choose an image concept & preview:</h4>
                                    <div className="space-y-3 mb-4">
                                        {imageSet.image_descriptions.map((desc, index) => (
                                            <label key={index} className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${selections[platform].imageIndex === index ? 'bg-indigo-50 border-indigo-500 shadow' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}>
                                                <input
                                                    type="radio"
                                                    name={`${platform}-image`}
                                                    checked={selections[platform].imageIndex === index}
                                                    onChange={() => handleSelectionChange(platform, 'image', index)}
                                                    className="sr-only"
                                                />
                                                <p className="text-sm text-slate-700">{desc}</p>
                                            </label>
                                        ))}
                                    </div>
                                    <button onClick={() => handleImageGeneration(platform)} disabled={imageState.isGenerating} className="w-full text-sm font-semibold text-indigo-700 border border-indigo-300 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-wait transition-colors">
                                        {imageState.isGenerating ? 'Generating...' : 'Generate Preview Image'}
                                    </button>

                                    <div className="mt-4 w-full aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                        {imageState.isGenerating && <SparklesIcon className="w-8 h-8 text-indigo-400 animate-spin" />}
                                        {imageState.error && <p className="text-red-500 text-sm p-4 text-center">{imageState.error}</p>}
                                        {imageState.url && !imageState.isGenerating && <img src={imageState.url} alt={`Generated preview for ${platform}`} className="w-full h-full object-cover rounded-lg" />}
                                        {!imageState.isGenerating && !imageState.url && !imageState.error && <p className="text-slate-500 text-sm">Image preview will appear here</p>}
                                    </div>

                                    {/* Prompt Display & Copy */}
                                    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-xs text-slate-600 font-mono break-words flex-1">{imageSet.image_descriptions[selections[platform].imageIndex]}</p>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(imageSet.image_descriptions[selections[platform].imageIndex]);
                                                    // Optional: Could add a toast or temporary state change to show "Copied!"
                                                }}
                                                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                                                title="Copy prompt to clipboard"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Email Template Selection */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Email Marketing</h3>
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Choose an email template:</h4>
                        <div className="space-y-3">
                            {draft.wordsmith.content_generation.email_templates.map((template, index) => (
                                <label key={index} className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedEmailIndex === index ? 'bg-green-50 border-green-500 shadow' : 'bg-slate-50 border-slate-200 hover:border-green-300'}`}>
                                    <input
                                        type="radio"
                                        name="email-template"
                                        checked={selectedEmailIndex === index}
                                        onChange={() => handleEmailSelection(index)}
                                        className="sr-only"
                                    />
                                    <p className="font-semibold text-slate-800">{template.email_type}</p>
                                    <p className="text-sm text-slate-600 mt-1"><strong>Subject:</strong> {template.subject_line_suggestions[0]}</p>
                                    <p className="text-xs text-slate-500 mt-2 truncate">{template.body_copy}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-12">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isLoading ? 'Processing...' : 'Confirm Selections & Build Launch Plan'}
                </button>
            </div>
        </div>
    );
};

export default CreativeRefinement;
