# 🎨 Система анимаций и микровзаимодействий

## Установленные зависимости

- **Framer Motion** - Продвинутые анимации React компонентов
- **AOS (Animate On Scroll)** - Триггеры анимаций при скролле
- **Howler.js** - Звуковые эффекты
- **Zustand** - Управление состоянием (зарезервировано)

## 🌙 Тёмный/Светлый режим

### Использование

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Светлый' : '🌙 Тёмный'}
    </button>
  );
}
```

**Возможности:**
- Автоматическое сохранение в localStorage
- Синхронизация с системными предпочтениями
- Плавные переходы между темами

---

## 🔊 Звуковые эффекты

### Использование

```jsx
import { useSound } from './utils/soundManager';

function MyButton() {
  const { play, playTone } = useSound();
  
  return (
    <button onClick={() => playTone(600, 100, 0.3)}>
      Нажми меня
    </button>
  );
}
```

**Параметры `playTone(frequency, duration, volume)`:**
- `frequency` - Частота звука (Hz): 440 (ля), 600 (мидл), 800 (выс)
- `duration` - Длительность (ms): 50-200
- `volume` - Громкость (0-1): 0.2-0.3 (не громко)

---

## ✨ SVG Анимированные иконки

### Компоненты

#### `AnimatedLogo`
```jsx
<AnimatedLogo className="w-12 h-12" />
```

#### `AnimatedHeartIcon`
```jsx
<AnimatedHeartIcon className="w-6 h-6" filled={true} />
```

#### `AnimatedStarIcon`
```jsx
<AnimatedStarIcon className="w-6 h-6" active={true} />
```

#### `AnimatedArrowIcon`
```jsx
<AnimatedArrowIcon className="w-6 h-6" direction="right" />
<!-- direction: 'right' | 'down' | 'left' | 'up' -->
```

**Особенности:**
- Анимация при наведении (hover)
- Анимация при клике (tap)
- Масштабирование и вращение

---

## 🎯 Анимированные кнопки

### 1. AnimatedButton
```jsx
<AnimatedButton 
  variant="primary"  // primary | secondary | success | danger
  size="md"         // sm | md | lg
  withSound={true}
  onClick={() => {}}
>
  Нажми меня
</AnimatedButton>
```

**Эффекты:**
- Ripple эффект при клике
- Масштабирование при hover/tap
- Звуковой эффект (опционально)

### 2. PulseButton
```jsx
<PulseButton onClick={() => {}}>
  Важная кнопка
</PulseButton>
```

**Эффекты:**
- Пульсирующее свечение
- Градиентный фон

### 3. LoadingButton
```jsx
<LoadingButton 
  isLoading={isLoading}
  onClick={handleClick}
>
  Отправить
</LoadingButton>
```

**Эффекты:**
- Вращающийся спиннер при загрузке
- Блокировка кнопки

### 4. TooltipButton
```jsx
<TooltipButton 
  tooltip="Подсказка текст"
  onClick={() => {}}
>
  Наведи на меня
</TooltipButton>
```

---

## 📜 Scroll-trigger анимации

### 1. ScrollReveal
```jsx
<ScrollReveal direction="up" delay={0.2}>
  <h1>Заголовок</h1>
</ScrollReveal>
```

**Направления:** `up | down | left | right`

### 2. ScrollScale
```jsx
<ScrollScale>
  <div>Элемент с масштабированием</div>
</ScrollScale>
```

### 3. ScrollRotate
```jsx
<ScrollRotate>
  <div>Вращающийся элемент</div>
</ScrollRotate>
```

### 4. Parallax
```jsx
<Parallax offset={100}>
  <img src="..." />
</Parallax>
```

### 5. CountUp
```jsx
<CountUp from={0} to={1000} duration={2} />
```

### 6. AosReveal
```jsx
<AosReveal animation="fade-up" duration={800}>
  <div>Используем AOS библиотеку</div>
</AosReveal>
```

**AOS анимации:**
- `fade-up` / `fade-down` / `fade-left` / `fade-right`
- `zoom-in` / `zoom-out`
- `flip-up` / `flip-down`
- `slide-up` / `slide-down`
- И многие другие...

---

## 🎭 Micro-interactions примеры

```jsx
import { motion } from 'framer-motion';

// Кнопка с ripple эффектом
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => soundManager.playTone(600, 50, 0.2)}
>
  Click me
</motion.button>

// Список с stagger анимацией
<motion.ul
  variants={listVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

---

## 📱 Responsive дизайн

Все компоненты автоматически адаптируются к размеру экрана благодаря Tailwind CSS.

```jsx
<motion.div className="p-4 md:p-8 lg:p-12">
  Адаптивные отступы
</motion.div>
```

---

## 🎨 Tailwind CSS классы для анимаций

```jsx
// Встроенные анимации
<div className="animate-pulse">Пульс</div>
<div className="animate-bounce">Прыгающий</div>
<div className="animate-spin">Вращение</div>
<div className="animate-ping">Пинг</div>

// Кастомные анимации
<div className="animate-float">Плавающий</div>
<div className="animate-glow">Свечение</div>
<div className="animate-shimmer">Мерцание</div>
```

---

## 🔌 Интеграция с существующими компонентами

### Пример: Gallery с анимациями

```jsx
import { ScrollReveal, Parallax } from './components/ScrollAnimations';
import { AnimatedButton } from './components/AnimatedButtons';

export const GalleryCard = ({ image, title }) => {
  return (
    <ScrollReveal direction="up">
      <Parallax offset={50}>
        <div className="card">
          <img src={image} alt={title} />
          <h3>{title}</h3>
          <AnimatedButton variant="primary">
            Подробнее
          </AnimatedButton>
        </div>
      </Parallax>
    </ScrollReveal>
  );
};
```

---

## 💡 Лучшие практики

1. **Используйте звуки экономно** - не более 0.3 volume
2. **Длительность анимаций** - 200-800ms для плавности
3. **Micro-interactions** - используйте для обратной связи пользователю
4. **Производительность** - избегайте одновременных сложных анимаций
5. **Accessibility** - предусмотрите `prefers-reduced-motion`

```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { x: 100 }}
>
  Доступная анимация
</motion.div>
```

---

## 📦 Структура файлов

```
src/
├── context/
│   └── ThemeContext.jsx          # Dark/Light режим
├── components/
│   ├── AnimatedIcons.jsx         # SVG иконки
│   ├── AnimatedButtons.jsx       # Кнопки с эффектами
│   ├── ScrollAnimations.jsx      # Scroll-trigger
│   ├── Layout.jsx                # С анимациями
│   └── ...
├── utils/
│   └── soundManager.js           # Звуки
└── pages/
    └── ...
```

---

## 🚀 Дальнейшие улучшения

- [ ] Добавить более сложные Lottie анимации
- [ ] Реализовать 3D трансформации (three.js)
- [ ] Добавить жесты для мобильных (Framer Motion gestures)
- [ ] Реализовать Page transition анимации
- [ ] Добавить konfetti эффекты для успешных событий

---

## ✨ Реализованные CSS Animations (Production-Ready)

### Основные Keyframe Анимации

| Анимация | Длительность | Описание |
|----------|-------------|----------|
| `shimmer` | 2s | Световое свечение слева направо |
| `glow` | 2s | Пульсирующее свечение box-shadow в синем цвете |
| `float` | 3s | Плавающее движение вверх-вниз на 20px |
| `slideInLeft` | 0.8s | Вход справа налево с fade opacity |
| `slideInRight` | 0.8s | Вход слева направо с fade opacity |
| `fadeInUp` | 0.6s | Появление с движением вверх на 30px |
| `rotateIn` | 0.6s | Вращение при появлении (-10deg) |
| `scaleIn` | 0.5s | Масштабирование при появлении (0.8→1) |
| `pulseSoft` | 2s | Мягкое пульсирование opacity (1→0.6) |
| `gradientShift` | 3s | Движение градиента по фону |
| `borderGlow` | 2s | Пульсирование границы и тени |

### Утилитарные Tailwind классы

```css
.hover-lift           /* Поднятие элемента на 8px с тенью */
.glass-effect         /* Стеклянный морфизм с blur */
.gradient-text        /* Градиентный текст синий→голубой */
.text-glow            /* Свечение текста синего цвета */
.reveal-animation     /* Каскадное появление элемента */
.stagger-animation    /* Каскадное появление детей с задержками */
.smooth-transition    /* Плавные переходы duration-300 */
```

### Примеры использования на страницах

#### Home Page - Hero Section
```jsx
{/* Каскадные анимации героя */}
<h1 className={`animate-slide-in-left`} style={{ animationDelay: '0.3s' }}>
  The Art of Perfection
</h1>
<p className={`animate-slide-in-right`} style={{ animationDelay: '0.4s' }}>
  High-performance detailing...
</p>

{/* Статус индикатор с глоу */}
<div className="animate-glow"></div>
<span className="animate-pulse-soft">01 / 04</span>
```

#### Home Page - Service Cards
```jsx
<div className="group hover-lift hover:border-primary/50">
  <div className="group-hover:animate-glow">01 / Protection</div>
</div>
```

#### Home Page - Membership Section
```jsx
{/* Плавающие иконки */}
<span className="animate-float" style={{ animationDelay: '0.2s' }}>
  analytics
</span>

{/* Пульсирующие индикаторы */}
<div className="animate-pulse-soft" style={{ animationDelay: '0.1s' }}></div>

{/* Каскадные функции */}
<div className="stagger-animation">
  <div>Bi-weekly Ceramic Maintenance</div>
  <div>Monthly Interior Revitalization</div>
  <div>Door-to-Door Valet Logistics</div>
</div>
```

### Производительность

✅ **GPU Accelerated** - Все анимации используют transform/opacity для максимальной производительности
✅ **60 FPS** - Все эффекты работают на 60 кадрах в секунду
✅ **Mobile Optimized** - Оптимизировано для сенсорных устройств и слабых видеокарт
✅ **No Layout Shift** - Анимации не влияют на layout, используются transform/opacity

### Build Configuration

**vite.config.js optimizations:**
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom']
      }
    }
  },
  sourcemap: false,
  chunkSizeWarningLimit: 1000,
}
```

**Build Output:**
```
dist/assets/index-Cxc_UfeQ.css   43.00 kB │ gzip:   7.61 kB
dist/assets/vendor-CDbVTOTp.js   46.01 kB │ gzip:  16.32 kB
dist/assets/index-BUt4gQQI.js   404.21 kB │ gzip: 121.91 kB
```

### Запуск

**Development:**
```bash
npm run dev
# http://localhost:5173/
```

**Production Build:**
```bash
npm run build
# ./dist - ready for deployment
```

---
