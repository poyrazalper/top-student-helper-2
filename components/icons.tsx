
import React from 'react';

type IconProps = {
  className?: string;
};

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const BookOpenIcon = ({ className }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const CalculatorIcon = ({ className }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM6 18L18 6M6 6l12 12" />
    </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const PencilSquareIcon = ({ className }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const BeakerIcon = ({ className }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.239.05.48.107.72.166m-1.021-.111a-4.5 4.5 0 015.632 0M16.5 14.5l-4.09-4.09a2.25 2.25 0 01-.659-1.591V3.104M16.5 14.5c.342.152.683.315 1.021.483m-1.021-.483a4.5 4.5 0 005.632 0M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const LightBulbIcon = ({ className }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a12.061 12.061 0 01-4.5 0m-3.75 0a12.061 12.061 0 014.5 0m0-2.311a6.01 6.01 0 00-1.5.189m-1.5-.189a6.01 6.01 0 01-1.5.189m0 0A2.25 2.25 0 015.625 5.625v-1.5a2.25 2.25 0 013.75 0v1.5m0 0a2.25 2.25 0 015.625 0v-1.5a2.25 2.25 0 013.75 0v1.5a2.25 2.25 0 01-2.25 2.25m-5.625 0a2.25 2.25 0 01-1.875-.938m1.875.938A2.25 2.25 0 0015 7.5v-1.5" />
  </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const AcademicCapIcon = ({ className }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-1.07-1.07m1.07 1.07l1.07 1.07M5.33 16.491L4.26 15.42m1.07 1.071l1.07-1.071" />
  </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const UserCircleIcon = ({ className }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// FIX: Changed from React.FC to a plain function for better type compatibility.
export const Logo = ({ className }: IconProps): React.JSX.Element => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <AcademicCapIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400 hidden sm:inline">SAT Prep Hub</span>
    </div>
);
