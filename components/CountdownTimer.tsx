import React, { useState, useEffect } from 'react';

const getInitialDate = () => {
    const savedDate = localStorage.getItem('satDate');
    if (savedDate) {
        return savedDate;
    }
    // Default to a future date
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    return futureDate.toISOString().split('T')[0];
};

const CountdownTimer: React.FC = () => {
    const [targetDate, setTargetDate] = useState(getInitialDate);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        localStorage.setItem('satDate', targetDate);

        const timer = setInterval(() => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
                <label htmlFor="sat-date" className="font-medium text-slate-600 dark:text-slate-300">Test Date:</label>
                <input
                    type="date"
                    id="sat-date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-1 text-xs"
                />
            </div>
            <div className="font-mono text-slate-800 dark:text-slate-200">
                <span className="font-bold">{String(timeLeft.days).padStart(2, '0')}</span>d{' '}
                <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>h{' '}
                <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>m{' '}
                <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>s
            </div>
        </div>
    );
};

export default CountdownTimer;