import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import useBookingStore from "../store/useBookingStore";
import { fullDateFormatter } from "../utils/formatters";
import { getPackageName } from "../utils/bookingUtils";

const BookingConfirmation = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { carModel, totalPrice, modules } = useBookingStore();
  const today = new Date();

  const confirmationId = "PRD-90124-B1";

  const handleCopyId = useCallback(() => {
    navigator.clipboard
      .writeText(confirmationId)
      .then(() => {
        addToast(t('confirmation.id_copied'), "success");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        addToast(t('confirmation.copy_failed'), "error");
      });
  }, [addToast, confirmationId, t]);

  return (
    <div className="pt-32 pb-24 px-4 lg:px-12 bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center">
      <div className="max-w-[800px] w-full flex flex-col items-center gap-6">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-5xl shadow-[0_0_15px_rgba(19,127,236,0.5)]">
              check_circle
            </span>
          </div>
          <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl md:text-5xl font-extrabold leading-tight pb-3">
            {t('confirmation.title')}
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-base md:text-lg font-normal leading-normal max-w-md">
            {t('confirmation.subtitle')}
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="w-full bg-white dark:bg-panel-dark rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/5 mt-4">
          {/* Vehicle Hero */}
          <div
            className="relative h-48 md:h-64 bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCx9wnmeST6ECJYFAvYmdB6xWlPMKPKqxTDfa-BGl1_3D16WSR-B8Pryxv90OV5_OK9TjftIlOfbeqFO-GDst3S7wTCzwgnIZHH6gJiTTJnmM4wHqO81-q0XS3FMXjLha9SNjh6lwdUgUb3LhbdKHobZCLvo0LuS1UcJGOGmqiOPJ0izUsdEgOafxBlagReXoinqiyt3Qjza9SIkUz2-dlJsU_65eGyHO5QI7Ph3TE5eEWv4witYcvKYB8ySFGTUw6sbv3fxArCrfU')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-panel-dark to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <h2 className="text-gray-900 dark:text-white text-2xl font-bold">
                {carModel}
              </h2>
              <p className="text-primary font-medium">
                {t('confirmation.approved')}
              </p>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-gray-900 dark:text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    calendar_today
                  </span>
                  {t('confirmation.appointment_details')}
                </h3>
                <div className="bg-gray-100 dark:bg-background-dark/50 p-4 rounded-lg border border-gray-200 dark:border-white/5">
                  <p className="text-gray-900 dark:text-white text-lg font-bold">
                    {fullDateFormatter.format(today)}
                  </p>
                  <p className="text-gray-600 dark:text-white/60">
                    {t('confirmation.selected_time')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-gray-900 dark:text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    construction
                  </span>
                  {t('confirmation.selected_services')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-white/60">
                      {getPackageName(modules)}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-white/5 pt-6 flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-white/40 text-xs uppercase font-bold tracking-widest">
                  {t('confirmation.total_investment')}
                </p>
                <p className="text-3xl font-extrabold text-primary">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <button className="h-10 px-4 flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-background-dark/50 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-all text-sm font-bold border border-gray-200 dark:border-white/5">
                <span className="material-symbols-outlined text-[18px]">
                  receipt_long
                </span>
                {t('confirmation.receipt')}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-2">
          <button className="flex-1 max-w-[240px] h-12 flex items-center justify-center gap-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all font-bold">
            <span className="material-symbols-outlined text-[20px]">
              calendar_add_on
            </span>
            {t('confirmation.add_calendar')}
          </button>
          <Link
            to="/"
            className="flex-1 max-w-[240px] h-12 flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            {t('confirmation.return_home')}
          </Link>
        </div>

        {/* Location & Support */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-panel-dark p-6 rounded-xl border border-gray-200 dark:border-white/5 flex gap-4 shadow-sm dark:shadow-none">
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-white font-bold mb-2">
                {t('confirmation.location.title')}
              </h3>
              <p className="text-gray-600 dark:text-white/60 text-sm mb-4">
                {t('confirmation.location.address_1')} <br />
                {t('confirmation.location.address_2')}
              </p>
              <a
                href="#"
                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[18px]">
                  directions
                </span>
                {t('confirmation.location.directions')}
              </a>
            </div>
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shrink-0">
              <div
                className="w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJIpKmQMt5Ulo-u14aYniZVaV6XgIImKujL8VkDWuUKwmspdeCy_CmiydKRnMCGwuDqFhzCrLb8N7t69u4pLBYtX9xZtU_o3e-PYX_1lMBZjLJRwuw1KvvI4H0bWmpuoMRIYAdci013e0dQRzABYLR3zj_HnWSx-YOWI_Ie-77E9laqrG-pEZ7XgJ0mUyfyzbKxsQTWHh7UhFMS_N85FP6eeELCaSGnag32Ta9lVfWo1tF95ebhm1NiUhFKhZL5ChP96_kACZF6FQ')",
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-panel-dark p-6 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold mb-2">
                {t('confirmation.help.title')}
              </h3>
              <p className="text-gray-600 dark:text-white/60 text-sm">
                {t('confirmation.help.desc')}
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <a
                href="tel:5551234567"
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-background-dark/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/5 text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
                {t('confirmation.help.call')}
              </a>
              <a
                href="mailto:support@prodetail.com"
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-background-dark/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/5 text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  mail
                </span>
                {t('confirmation.help.email')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pb-12 text-center flex flex-col items-center gap-2">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={handleCopyId}
            title={t('confirmation.copy_id_title')}
          >
            <div className="text-gray-400 dark:text-white/30 text-xs font-mono bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded border border-gray-200 dark:border-white/10 group-hover:border-primary group-hover:text-primary transition-all flex items-center gap-2 shadow-sm">
              <span>
                {t('confirmation.id_label')}{" "}
                <span className="font-bold text-gray-600 dark:text-white/60 group-hover:text-primary">
                  {confirmationId}
                </span>
              </span>
              <button
                aria-label={t('confirmation.copy_id_aria')}
                className="text-gray-400 group-hover:text-primary transition-colors flex items-center"
              >
                <span className="material-symbols-outlined text-[14px]">
                  content_copy
                </span>
              </button>
            </div>
          </div>
          <p className="text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-[0.2em] mt-2">
            {t('confirmation.copyright')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
