import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const DEV_TIPS = [
    "Write code that tells a story - future you will thank present you.",
    "'Code is read more often than it is written' - Always optimize for readability.",
    "Debug with print statements, but don't forget to remove them!",
    "'The best code is no code at all' - Sometimes deletion is the best refactor.",
    "Learn your editor's shortcuts - they compound over time.",
    "'Make it work, make it right, make it fast' - in that order.",
    "Version control everything - even your shopping lists deserve Git.",
    "'There are only two hard things in Computer Science: cache invalidation and naming things.'",
    "Read the error message twice before Googling it.",
    "'Code never lies, comments sometimes do' - Keep them in sync.",
    "'Security is not a product, but a process' - Build it in from day one.",
    "'Documentation is a love letter that you write to your future self.'",
    "'Testing leads to failure, and failure leads to understanding.'",
    "'Premature optimization is the root of all evil' - Donald Knuth",
    "'The only way to learn a new programming language is by writing programs in it.' - Dennis Ritchie",
    "'Code refactoring is like doing laundry - put it off too long and it becomes overwhelming.'",
    "'Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.'",
    "'The most important property of a program is whether it accomplishes the intention of its user.'",
    "'Programs must be written for people to read, and only incidentally for machines to execute.'",
    "'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.'",
    "'First, solve the problem. Then, write the code.'",
    "'Simplicity is the ultimate sophistication.' - Leonardo da Vinci",
    "'If debugging is the process of removing bugs, then programming must be the process of putting them in.'",
    "'There's nothing more permanent than a temporary solution that works.'",
    "'The best error message is the one that never shows up.'",
    "'A good programmer is someone who always looks both ways before crossing a one-way street.'",
    "'Code is like humor. When you have to explain it, it's bad.'",
    "'Clean code always looks like it was written by someone who cares.'",
    "'Walking on water and developing software from a specification are easy if both are frozen.'",
    "'The function of good software is to make the complex appear to be simple.'",
    "Don't repeat yourself - if you're copying code, consider making it a function.",
    "Write tests before you write code - it clarifies what you're trying to build.",
    "Use meaningful variable names - 'data' and 'temp' tell you nothing.",
    "Comment why, not what - the code shows what, comments should explain why.",
    "Fail fast and fail loud - catch errors early and make them obvious.",
    "Keep functions small - if it doesn't fit on your screen, it's too long.",
    "Consistency is more important than personal preference in team projects.",
    "Learn to love the debugger - it's more reliable than print statements.",
    "Write code for humans first, machines second.",
    "The best architecture is the one that solves the problem at hand.",
    "Don't optimize unless you have a performance problem.",
    "Code reviews are not personal attacks - they're collaborative improvements.",
    "Master your tools - a craftsman knows their instruments.",
    "Read other people's code - it's the fastest way to learn new patterns.",
    "Error handling is not optional - plan for things to go wrong.",
    "Automate repetitive tasks - your time is better spent solving problems.",
    "Learn the fundamentals - frameworks come and go, principles remain.",
    "Test your assumptions - especially the ones that seem obvious.",
    "Code is a liability, not an asset - every line has a maintenance cost.",
    "Separate concerns - each module should have one reason to change.",
    "Use version control for everything - commit early, commit often.",
    "Design for change - requirements will evolve, plan for it.",
    "Performance problems are usually data structure problems in disguise.",
    "The compiler is your friend - let it catch errors for you.",
    "Write self-documenting code - good names eliminate the need for comments.",
    "Understand your dependencies - they're part of your codebase now.",
    "Measure twice, cut once - think before you code.",
    "Every decision is a trade-off - understand what you're giving up.",
    "Code style matters - consistent formatting reduces cognitive load.",
    "Learn to refactor safely - small changes reduce risk.",
    "The best debugging tool is a good night's sleep.",
    "Don't write clever code - write clear code that works.",
    "Use the right tool for the job - not every problem is a nail.",
    "Backup your work - disasters happen when you least expect them.",
    "Learn from your mistakes - they're expensive lessons, don't waste them.",
    "Code is communication - make sure your message is clear.",
    "Think in systems - understand how your code fits into the bigger picture.",
    "Practice makes perfect - code every day, even if it's just for 15 minutes.",
    "Ask for help when you're stuck - fresh eyes see new solutions.",
    "Celebrate small wins - programming is a marathon, not a sprint.",
    "Learn to say no - not every feature request improves the product.",
    "Understand the problem domain - you can't solve what you don't understand.",
    "Keep learning - technology evolves, and so should you."
];

const DevTip = () => {
    const [devTip, setDevTip] = useState("");
    const [loading, setLoading] = useState(false);
    const [usedTips, setUsedTips] = useState(new Set());

    const getRandomTip = () => {
        let availableTips = DEV_TIPS;

        if (usedTips.size >= DEV_TIPS.length) {
            setUsedTips(new Set());
        } else {
            availableTips = DEV_TIPS.filter((_, index) => !usedTips.has(index));
        }

        const randomIndex = Math.floor(Math.random() * availableTips.length);
        const selectedTip = availableTips[randomIndex];

        const originalIndex = DEV_TIPS.indexOf(selectedTip);
        setUsedTips(prev => new Set([...prev, originalIndex]));

        return selectedTip;
    };

    const fetchTip = () => {
        setLoading(true);

        setTimeout(() => {
            const tip = getRandomTip();
            setDevTip(tip);
            setLoading(false);
        }, 200);
    };

    useEffect(() => {
        const initialTip = getRandomTip();
        setDevTip(initialTip);
    }, []);

    const containerStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        padding: '0 60px 0 20px',
    };

    const tipStyle = {
        color: 'white',
        fontSize: '16px',
        lineHeight: '1.6',
        margin: '0',
        textAlign: 'center',
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.3s ease',
    };

    const buttonStyle = {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '36px',
        height: '36px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        opacity: loading ? 0.6 : 1,
    };

    const iconStyle = {
        width: '18px',
        height: '18px',
        color: 'white',
        transform: loading ? 'rotate(360deg)' : 'rotate(0deg)',
        transition: 'transform 0.6s ease',
    };

    const handleNewTip = () => {
        if (!loading) {
            fetchTip();
        }
    };

    const handleButtonHover = (e, isHover) => {
        if (!loading) {
            e.target.style.background = isHover
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = isHover
                ? 'translateY(-50%) scale(1.1)'
                : 'translateY(-50%) scale(1)';
        }
    };

    return (
        <div style={containerStyle}>
            {loading ? (
                <p style={tipStyle}>Loading wisdom...</p>
            ) : (
                <p style={tipStyle}>{devTip}</p>
            )}
            <button
                style={buttonStyle}
                onClick={handleNewTip}
                disabled={loading}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                title="Get new tip"
            >
                <RefreshCw style={iconStyle} />
            </button>
        </div>
    );
};

export default DevTip;