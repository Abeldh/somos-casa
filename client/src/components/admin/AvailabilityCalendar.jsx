import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import { DAYS_ES, MONTHS_ES } from '../../utils/constants';
import { toISODate } from '../../utils/formatDate';
import { classNames } from '../../utils/helpers';

export default function AvailabilityCalendar({ availableDates = [], onSelectDate, selectedDate }) {
  const { currentMonth, currentYear, daysInMonth, firstDay, goNext, goPrev } = useCalendar();

  const hasSlots = (day) => {
    const dateStr = toISODate(new Date(currentYear, currentMonth, day));
    return availableDates.includes(dateStr);
  };

  const isSelected = (day) => {
    const dateStr = toISODate(new Date(currentYear, currentMonth, day));
    return selectedDate === dateStr;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goPrev} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {MONTHS_ES[currentMonth]} {currentYear}
        </h3>
        <button onClick={goNext} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_ES.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const available = hasSlots(day);
          const selected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => onSelectDate(toISODate(new Date(currentYear, currentMonth, day)))}
              className={classNames(
                'w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative',
                selected && 'bg-primary-600 text-white',
                !selected && available && 'bg-green-50 text-green-700 hover:bg-green-100',
                !selected && !available && 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {day}
              {available && !selected && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
