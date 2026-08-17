import { Check } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const steps = [
  { id: 1, label: 'Fecha y hora' },
  { id: 2, label: 'Información' },
  { id: 3, label: 'Confirmación' },
];

export default function BookingSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={classNames(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                currentStep > step.id && 'bg-green-500 text-white',
                currentStep === step.id && 'bg-primary-600 text-white shadow-lg shadow-primary-200',
                currentStep < step.id && 'bg-gray-100 text-gray-400'
              )}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span className={classNames(
              'text-xs mt-2 font-medium',
              currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'
            )}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={classNames(
              'w-16 sm:w-24 h-0.5 mx-2 mt-[-1rem]',
              currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
