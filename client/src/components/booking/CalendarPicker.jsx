import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import { DAYS_ES, MONTHS_ES } from '../../utils/constants';
import { isPast, toISODate } from '../../utils/formatDate';
import { classNames } from '../../utils/helpers';

export default function CalendarPicker({ selectedDate, onSelectDate, availableDates = [] }) {
  const { currentMonth, currentYear, daysInMonth, firstDay, goNext, goPrev } = useCalendar();

  const isAvailable = (day) => {
    const dateStr = toISODate(new Date(currentYear, currentMonth, day));
    return availableDates.includes(dateStr);
  };

  const isSelected = (day) => {
    const dateStr = toISODate(new Date(currentYear, currentMonth, day));
    return selectedDate === dateStr;
  };

  const handleSelect = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    if (isPast(date) || !isAvailable(day)) return;
    onSelectDate(toISODate(date));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goPrev} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {MONTHS_ES[currentMonth]} {currentYear}
        </h3>
        <button onClick={goNext} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_ES.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const past = isPast(date);
          const available = isAvailable(day);
          const selected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              disabled={past || !available}
              className={classNames(
                'w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                past && 'text-gray-300 cursor-not-allowed',
                !past && !available && 'text-gray-400 cursor-not-allowed',
                !past && available && !selected && 'text-gray-700 hover:bg-primary-50 hover:text-primary-700',
                selected && 'bg-primary-600 text-white shadow-sm'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-primary-600" /> Seleccionado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300" /> Disponible
        </span>
      </div>
    </div>
  );
}
