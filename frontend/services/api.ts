import { UserInput, Persona, CreativeDraft } from '../types';

const API_URL = "http://localhost:8000";

export const startWorkflow = async (userInput: UserInput) => {
    const response = await fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput })
    });
    if (!response.ok) throw new Error("Failed to start workflow");
    return response.json();
};

export const submitPersonaFeedback = async (threadId: string, persona: Persona) => {
    const response = await fetch(`${API_URL}/feedback/persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, selected_data: persona })
    });
    if (!response.ok) throw new Error("Failed to submit persona");
    return response.json();
};

export const submitCreativeFeedback = async (threadId: string, draft: CreativeDraft) => {
    const response = await fetch(`${API_URL}/feedback/creative`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, selected_data: draft })
    });
    if (!response.ok) throw new Error("Failed to submit creative");
    return response.json();
};