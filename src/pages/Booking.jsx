import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Components';
import useBookingStore from '../store/useBookingStore';
import { monthYearFormatter, fullDateFormatter, shortMonthFormatter } from '../utils/formatters';
import { getPackageName } from '../utils/bookingUtils';

const Booking = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { carModel, modules, totalPrice } = useBookingStore();

  const [viewDate, setViewDate] = useState(new Date());
  const today = useMemo(() => new Date(), []);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const currentDay = today.getDate();

  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const { days, emptyDays } = useMemo(() => {
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const daysArray = Array.from({ length: numDays }, (_, i) => {
      const day = i + 1;
      const dateObj = new Date(currentYear, currentMonth, day);
      return {
        day,
        isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6,
        fullDate: fullDateFormatter.format(dateObj)
      };
    });

    return {
      days: daysArray,
      emptyDays: Array.from({ length: firstDayOfMonth })
    };
  }, [currentYear, currentMonth]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // Format date as ISO for the backend (YYYY-MM-DD) using view month/year
    const bookingDate = new Date(currentYear, currentMonth, selectedDate);
    // Use local year, month, day to avoid timezone issues with toISOString()
    const yyyy = bookingDate.getFullYear();
    const mm = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const dd = String(bookingDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          time: selectedTime,
          carModel: carModel,
          packageName: getPackageName(modules),
          totalPrice: totalPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm booking');
      }

      addToast('Booking successfully scheduled!', 'success');
      navigate('/booking-confirmation');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 lg:px-12 bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-8">

        {/* Header & Progress */}
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
                <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl font-extrabold">Schedule Your Detailing Session</h1>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest">Step 2 of 3</span>
                    <p className="text-gray-600 dark:text-white text-sm font-medium">Date & Time Selection</p>
                </div>
            </div>
            <div
                className="w-full rounded-full bg-gray-200 dark:bg-white/10 h-2.5 overflow-hidden"
                role="progressbar"
                aria-valuenow="66"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Booking progress"
            >
                <div className="h-full rounded-full bg-primary" style={{ width: '66%' }}></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Calendar */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold">Pick a Date</h3>
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Previous month"
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-900 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <p
                                className="text-gray-900 dark:text-white text-base font-bold min-w-[140px] text-center uppercase tracking-wide"
                                aria-live="polite"
                            >
                                {monthYearFormatter.format(viewDate)}
                            </p>
                            <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-900 dark:text-white transition-colors"
                                aria-label="Next month"
                                onClick={handleNextMonth}
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 text-center mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <span key={day} className={`text-[11px] font-black uppercase tracking-tighter ${['Sun', 'Sat'].includes(day) ? 'text-primary opacity-80' : 'text-gray-400 dark:text-white/40'}`}>{day}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells - pre-calculated to avoid redundant new Date() calls */}
                        {emptyDays.map((_, i) => (
                            <div key={`empty-${i}`} className="h-14"></div>
                        ))}
                        {days.map(({ day, fullDate, isWeekend }) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                aria-label={`Select ${fullDate}${isWeekend ? ' - Weekend Special' : ''}`}
                                aria-pressed={selectedDate === day}
                                className={`h-14 flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-all relative ${selectedDate === day ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white'}`}
                            >
                                <span className="relative z-10">{day}</span>
                                {isWeekend && (
                                    <span className={`absolute bottom-2.5 size-1 rounded-full ${selectedDate === day ? 'bg-white' : 'bg-primary'} shadow-[0_0_4px_rgba(19,127,236,0.4)]`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-gray-700 dark:text-white/90 text-sm">Appointments on weekends include a complimentary exterior foam wash.</p>
                </div>
            </div>

            {/* Time & Summary */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Summary Card */}
                <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 dark:text-white/50 text-xs font-bold uppercase tracking-widest">Your Selection</p>
                        <Link
                            to="/calculator"
                            className="text-primary hover:underline text-xs font-bold"
                            aria-label="Change vehicle or package selection"
                        >
                            Change
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="size-20 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCx9wnmeST6ECJYFAvYmdB6xWlPMKPKqxTDfa-BGl1_3D16WSR-B8Pryxv90OV5_OK9TjftIlOfbeqFO-GDst3S7wTCzwgnIZHH6gJiTTJnmM4wHqO81-q0XS3FMXjLha9SNjh6lwdUgUb3LhbdKHobZCLvo0LuS1UcJGOGmqiOPJ0izUsdEgOafxBlagReXoinqiyt3Qjza9SIkUz2-dlJsU_65eGyHO5QI7Ph3TE5eEWv4witYcvKYB8ySFGTUw6sbv3fxArCrfU')" }}></div>
                        <div className="flex flex-col">
                            <p className="text-gray-900 dark:text-white text-base font-bold leading-tight">{carModel}</p>
                            <p className="text-primary text-sm font-bold">{getPackageName(modules)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="material-symbols-outlined text-[16px] text-gray-400 dark:text-white/40">schedule</span>
                                <p className="text-gray-500 dark:text-white/60 text-xs font-medium">4-5 Hours Duration</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold">Select Start Time</h3>
                        <span className="text-gray-500 dark:text-white/40 text-xs font-medium">
                            {shortMonthFormatter.format(viewDate)} {selectedDate}, {currentYear}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { time: '08:00 AM', label: 'Morning', avail: true },
                            { time: '10:30 AM', label: 'Morning', avail: true },
                            { time: '01:00 PM', label: 'Afternoon', avail: true },
                            { time: '03:30 PM', label: 'Afternoon', avail: true },
                            { time: '06:00 PM', label: 'Fully Booked', avail: false },
                            { time: '08:30 PM', label: 'Evening', avail: true },
                        ].map((slot) => (
                            <button
                                key={slot.time}
                                disabled={!slot.avail}
                                onClick={() => setSelectedTime(slot.time)}
                                aria-label={`${slot.time} ${slot.label}${!slot.avail ? ' - Fully Booked' : ''}`}
                                aria-pressed={selectedTime === slot.time}
                                className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${!slot.avail ? 'border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 opacity-50 cursor-not-allowed' : selectedTime === slot.time ? 'border-primary bg-primary shadow-lg shadow-primary/20 transform scale-[1.02]' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/50 group'}`}
                            >
                                <span className={`text-sm font-bold mb-1 ${!slot.avail ? 'text-gray-400 dark:text-white/40' : selectedTime === slot.time ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{slot.time}</span>
                                <span className={`text-[10px] uppercase font-bold ${!slot.avail ? 'text-gray-300 dark:text-white/20' : selectedTime === slot.time ? 'text-white/70' : 'text-gray-400 dark:text-white/40 group-hover:text-primary transition-colors'}`}>{slot.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <Link
                to="/calculator"
                aria-label="Go back to the service calculator"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="font-bold">Back</span>
            </Link>
            <div className="flex items-center gap-8">
                <div className="flex flex-col text-right">
                    <span className="text-gray-500 dark:text-white/50 text-[10px] font-black uppercase tracking-widest">Total Estimated</span>
                    <span className="text-gray-900 dark:text-white text-2xl font-black">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleConfirm} 
                  isLoading={isSubmitting}
                  className="gap-3 px-10 py-4 rounded-xl text-lg shadow-2xl shadow-primary/40 h-auto"
                >
                    <span>{isSubmitting ? 'Processing...' : 'Confirm Booking'}</span>
                    {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
