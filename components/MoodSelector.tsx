import React from 'react';
import { MoodType } from '../types';
import { MOOD_CONFIGS } from '../constants';

interface MoodSelectorProps {
  onSelect: (mood: MoodType) => void;
  disabled: boolean;
  selectedMood: MoodType | null;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect, disabled, selectedMood }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto p-4">
      {MOOD_CONFIGS.map((m) => {
        const isSelected = selectedMood === m.type;
        const isAnySelected = selectedMood !== null;
        
        return (
          <button
            key={m.type}
            onClick={() => onSelect(m.type)}
            disabled={disabled}
            className={`
              relative p-8 rounded-[2.5rem] border-2 text-center group backdrop-blur-md
              transition-all duration-500 ease-out-spring
              dark:bg-midnight-900/60 bg-white shadow-xl
              
              ${isSelected 
                  ? 'ring-4 ring-gold-500/40 scale-105 shadow-[0_0_40px_rgba(245,158,11,0.2)] z-10 border-gold-500' 
                  : isAnySelected 
                    ? 'opacity-40 scale-95 blur-[0.5px] border-transparent' 
                    : 'scale-100 dark:border-gold-600/40 border-gold-500/10 hover:scale-105 hover:border-gold-500/40'
              }

              ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : 'cursor-pointer'}
            `}
          >
            <div className={`
              text-5xl mb-4 transition-transform duration-500 ease-out-spring
              ${isSelected ? 'scale-125' : 'group-hover:scale-110'}
            `}>
              {m.icon}
            </div>
            
            <div className="transition-all duration-300">
              <div className="font-bold text-xl dark:text-gold-200 text-midnight-950 group-hover:text-gold-600">{m.type}</div>
              <div className="text-xs opacity-60 mt-1 uppercase tracking-widest font-medium dark:text-gold-500 text-gold-700">{m.description}</div>
            </div>
            
            {/* Animated Checkmark */}
            {isSelected && (
              <div className="absolute top-4 right-4 text-gold-500 animate-bounce-in bg-gold-500/10 rounded-full p-2 border border-gold-500/40">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;