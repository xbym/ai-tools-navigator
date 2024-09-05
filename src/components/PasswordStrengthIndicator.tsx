'use client';

import React from 'react';
import { checkPasswordStrength } from '@/utils/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, feedback } = checkPasswordStrength(password);

  const getStrengthLabel = (score: number) => {
    if (score === 0) return '非常弱';
    if (score === 1) return '弱';
    if (score === 2) return '一般';
    if (score === 3) return '强';
    if (score === 4) return '很强';
    return '非常强';
  };

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-orange-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    if (score === 4) return 'bg-green-500';
    return 'bg-green-700';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStrengthColor(score)}`}
            style={{ width: `${(score / 5) * 100}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm">{getStrengthLabel(score)}</span>
      </div>
      {feedback.length > 0 && (
        <ul className="mt-2 text-sm text-red-500">
          {feedback.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;