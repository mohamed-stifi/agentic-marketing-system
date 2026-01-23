
import React from 'react';

const RobotIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 001.085.67l.415-.207m-1.5 0V15m1.5 0v-4.5m-1.5 0h.008m1.492 0h.008m-3.75 0h.008m-1.5 0h.008m1.5 0h.008m1.492 0h.008M4.5 7.5h15v9a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 16.5v-9z" />
    </svg>
);

export default RobotIcon;
