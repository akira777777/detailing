import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/soundManager';
import {
  AnimatedButton,
  PulseButton,
  LoadingButton,
  TooltipButton,
} from '../components/AnimatedButtons';
import {
  AnimatedLogo,
  AnimatedHeartIcon,
  AnimatedStarIcon,
  AnimatedArrowIcon,
} from '../components/AnimatedIcons';
import {
  ScrollReveal,
  ScrollScale,
  CountUp,
  AosReveal,
  Parallax,
} from '../components/ScrollAnimations';

const AnimationsShowcase = () => {
  useTheme(); // Theme context used for dark mode classes
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedStars, setSelectedStars] = useState([false, false, false, false, false]);

  const handleLoadingButton = () => {
    setIsLoading(true);
    soundManager.playTone(800, 200, 0.3);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleStarClick = (index) => {
    const newStars = [...selectedStars];
    newStars[index] = !newStars[index];
    setSelectedStars(newStars);
    soundManager.playTone(600 + index * 100, 150, 0.25);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 lg:px-12 bg-white dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <ScrollReveal direction="up">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            🎨 Система анимаций & Микровзаимодействия
          </h1>
          <p className="text-lg text-gray-600 dark:text-white/60">
            Демонстрация всех возможностей Framer Motion, AOS, SVG анимаций и звуков
          </p>
        </div>
      </ScrollReveal>

      <div className="max-w-6xl mx-auto space-y-24">
        {/* Section 1: SVG Animated Icons */}
        <ScrollReveal direction="left">
          <div className="rounded-xl p-12 bg-gray-50 dark:bg-panel-dark transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-12 text-gray-900 dark:text-white">
              ✨ SVG Анимированные иконки
            </h2>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
                <AnimatedLogo className="w-16 h-16 text-primary" />
                <p className="text-sm text-gray-600 dark:text-white/60">Logo</p>
              </motion.div>

              <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
                <motion.div
                  className="cursor-pointer"
                  onClick={() => {
                    setLikeCount(likeCount + 1);
                    soundManager.playTone(800, 100, 0.3);
                  }}
                >
                  <AnimatedHeartIcon
                    className="w-16 h-16 text-red-500"
                    filled={likeCount > 0}
                  />
                </motion.div>
                <p className="text-sm text-gray-600 dark:text-white/60">
                  Лайки: {likeCount}
                </p>
              </motion.div>

              <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
                <p className="text-sm text-gray-600 dark:text-white/60">Рейтинг:</p>
                <div className="flex gap-1">
                  {selectedStars.map((active, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleStarClick(idx)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatedStarIcon
                        className="w-6 h-6 text-yellow-500"
                        active={active}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
                <AnimatedArrowIcon className="w-16 h-16 text-primary" />
                <p className="text-sm text-gray-600 dark:text-white/60">Arrow</p>
              </motion.div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Section 2: Animated Buttons */}
        <ScrollReveal direction="right">
          <div className="rounded-xl p-12 bg-gray-50 dark:bg-panel-dark transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-12 text-gray-900 dark:text-white">
              🔘 Анимированные кнопки
            </h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div variants={itemVariants} className="flex justify-center">
                <AnimatedButton variant="primary" size="md">
                  Primary
                </AnimatedButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <AnimatedButton variant="success" size="md">
                  Success
                </AnimatedButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <AnimatedButton variant="danger" size="md">
                  Danger
                </AnimatedButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <PulseButton>Pulse</PulseButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <LoadingButton isLoading={isLoading} onClick={handleLoadingButton}>
                  {isLoading ? 'Отправка...' : 'Загрузить'}
                </LoadingButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <TooltipButton tooltip="Это подсказка!" onClick={() => soundManager.playTone(600, 100, 0.2)}>
                  Подсказка
                </TooltipButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <AnimatedButton variant="secondary" size="lg">
                  Large
                </AnimatedButton>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <AnimatedButton size="sm">Small</AnimatedButton>
              </motion.div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Section 3: Scroll Animations */}
        <ScrollReveal direction="up">
          <div className="rounded-xl p-12 bg-gray-50 dark:bg-panel-dark transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-12 text-gray-900 dark:text-white">
              📜 Scroll-trigger анимации
            </h2>

            <motion.div className="space-y-12">
              {/* ScrollScale Example */}
              <ScrollScale>
                <div className="p-8 rounded-lg border-2 border-primary bg-blue-50 dark:bg-surface-dark transition-colors duration-300">
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                    Scale Animation
                  </h3>
                  <p className="text-gray-600 dark:text-white/60">
                    Этот элемент масштабируется при скролле
                  </p>
                </div>
              </ScrollScale>

              {/* CountUp Example */}
              <AosReveal animation="zoom-in">
                <div className="p-8 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-surface-dark transition-colors duration-300">
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                    Counter Animation
                  </h3>
                  <div className="text-4xl font-bold text-green-500">
                    <CountUp from={0} to={5000} duration={3} />+
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-white/60">
                    Счётчик с анимацией
                  </p>
                </div>
              </AosReveal>

              {/* Parallax Example */}
              <Parallax offset={100}>
                <div className="p-8 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-surface-dark transition-colors duration-300">
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                    Parallax Effect
                  </h3>
                  <p className="text-gray-600 dark:text-white/60">
                    Элемент движется параллельно при скролле
                  </p>
                </div>
              </Parallax>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Section 4: Features Grid */}
        <ScrollReveal direction="left">
          <div className="rounded-xl p-12 bg-gray-50 dark:bg-panel-dark transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-12 text-gray-900 dark:text-white">
              🎯 Особенности
            </h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              {[
                { icon: '🌙', title: 'Dark/Light режим', desc: 'Переключение тем с сохранением' },
                { icon: '🔊', title: 'Звуковые эффекты', desc: 'Интерактивные звуки при клике' },
                { icon: '✨', title: 'SVG анимации', desc: 'Анимированные логотипы и иконки' },
                { icon: '📜', title: 'Scroll-trigger', desc: 'Анимации при скролле страницы' },
                { icon: '🎭', title: 'Micro-interactions', desc: 'Ripple эффекты и переходы' },
                { icon: '⚡', title: 'Производительность', desc: 'Оптимизирована для всех устройств' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-6 rounded-lg border bg-white border-gray-200 dark:bg-surface-dark dark:border-white/10 hover:border-primary transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/60">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Section 5: Interactive Demo */}
        <ScrollReveal direction="right">
          <div className="rounded-xl p-12 bg-gray-50 dark:bg-panel-dark transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-12 text-gray-900 dark:text-white">
              🎪 Интерактивная демонстрация
            </h2>

            <motion.div
              className="flex flex-col items-center gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div
                variants={itemVariants}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center"
              >
                <span className="text-4xl">🎨</span>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg text-center max-w-2xl text-gray-600 dark:text-white/60"
              >
                Наведите на элементы и нажимайте кнопки, чтобы увидеть полный спектр анимаций и звуковых эффектов.
                Попробуйте включить/отключить тёмный режим!
              </motion.p>

              <motion.button
                variants={itemVariants}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundManager.playTone(400, 200, 0.4);
                  soundManager.playTone(600, 200, 0.3);
                  soundManager.playTone(800, 200, 0.2);
                }}
              >
                🎵 Воспроизведи мелодию!
              </motion.button>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AnimationsShowcase;
