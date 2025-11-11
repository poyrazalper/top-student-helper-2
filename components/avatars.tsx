import React from 'react';

type IconProps = {
  className?: string;
};

const Avatar1: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(129, 140, 248)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#grad1)" />
    </svg>
);

const Avatar2: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" rx="20" fill="#f472b6" />
        <path d="M0 20 L100 80 M0 50 L100 50 M20 0 L80 100 M50 0 L50 100" stroke="#db2777" strokeWidth="4" strokeOpacity="0.5" />
    </svg>
);

const Avatar3: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M50 0 L100 100 L0 100 Z" fill="#34d399" />
        <path d="M50 20 L80 80 L20 80 Z" fill="#a7f3d0" />
    </svg>
);

const Avatar4: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#60a5fa" />
        <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="5" fill="none" />
        <path d="M0 70 Q 25 45, 50 70 T 100 70" stroke="white" strokeWidth="5" fill="none" strokeOpacity="0.7" />
    </svg>
);

const Avatar5: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#1e293b" />
        <path d="M50 10 L65 40 H35 Z" fill="white" />
        <rect x="40" y="40" width="20" height="40" fill="#e2e8f0" />
        <path d="M30 80 L20 95 H80 L70 80 Z" fill="#fb923c" />
        <circle cx="50" cy="60" r="8" fill="#60a5fa" />
    </svg>
);

const Avatar6: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#f5f5f5" />
        <path d="M20 10 H80 V90 H20 Z" fill="#a8a29e" />
        <path d="M25 10 H75 V90 H25 Z" fill="white" />
        <rect x="35" y="25" width="30" height="5" fill="#d6d3d1" />
        <rect x="35" y="40" width="30" height="5" fill="#d6d3d1" />
        <rect x="35" y="55" width="30" height="5" fill="#d6d3d1" />
    </svg>
);

const Avatar7: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <radialGradient id="grad7" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#fde047', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 1}} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#grad7)" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
    </svg>
);

const Avatar8: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#0f172a"/>
        <path d="M 10 10 C 20 20, 40 20, 50 10 S 70 0, 90 10" stroke="#38bdf8" fill="transparent" strokeWidth="4"/>
        <path d="M 10 30 C 20 40, 40 40, 50 30 S 70 20, 90 30" stroke="#38bdf8" fill="transparent" strokeWidth="4" strokeOpacity="0.8"/>
        <path d="M 10 50 C 20 60, 40 60, 50 50 S 70 40, 90 50" stroke="#818cf8" fill="transparent" strokeWidth="4"/>
        <path d="M 10 70 C 20 80, 40 80, 50 70 S 70 60, 90 70" stroke="#818cf8" fill="transparent" strokeWidth="4" strokeOpacity="0.8"/>
        <path d="M 10 90 C 20 100, 40 100, 50 90 S 70 80, 90 90" stroke="#c084fc" fill="transparent" strokeWidth="4"/>
    </svg>
);

const Avatar9: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#ecfdf5"/>
        <circle cx="50" cy="50" r="30" fill="#d1fae5"/>
        <circle cx="50" cy="50" r="20" fill="#a7f3d0"/>
        <circle cx="50" cy="50" r="10" fill="#6ee7b7"/>
    </svg>
);

const Avatar10: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#fef2f2"/>
        <path d="M20,20 L80,80 M80,20 L20,80" stroke="#ef4444" strokeWidth="10" strokeLinecap="round"/>
    </svg>
);

const Avatar11: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#f5f3ff"/>
        <path d="M0 0 H50 V50 H0Z" fill="#ede9fe"/>
        <path d="M50 0 H100 V50 H50Z" fill="#ddd6fe"/>
        <path d="M0 50 H50 V100 H0Z" fill="#c4b5fd"/>
        <path d="M50 50 H100 V100 H50Z" fill="#a78bfa"/>
    </svg>
);

const Avatar12: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="100" height="100" fill="#e0f2fe"/>
        <path d="M 50,5 L 58,33 L 88,33 L 65,52 L 72,80 L 50,65 L 28,80 L 35,52 L 12,33 L 42,33 Z" fill="#38bdf8"/>
    </svg>
);

export const AVATARS: React.FC<IconProps>[] = [
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
    Avatar8,
    Avatar9,
    Avatar10,
    Avatar11,
    Avatar12,
];