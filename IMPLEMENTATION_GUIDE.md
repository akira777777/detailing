# 🚀 Руководство по внедрённым анимациям и микровзаимодействиям

## 📋 Содержание

1. [Установленные библиотеки](#установленные-библиотеки)
2. [Система тём (Dark/Light)](#система-тём)
3. [Звуковые эффекты](#звуковые-эффекты)
4. [SVG анимированные иконки](#svg-анимированные-иконки)
5. [Анимированные кнопки](#анимированные-кнопки)
6. [Scroll-trigger эффекты](#scroll-trigger-эффекты)
7. [Примеры использования](#примеры-использования)
8. [Структура проекта](#структура-проекта)

---

## 🎁 Установленные библиотеки

```json
{
  "framer-motion": "^11.x",      // Продвинутые анимации React
  "aos": "^2.3.4",               // Scroll-trigger библиотека
  "howler": "^2.2.x",            // Звуки и аудио
  "zustand": "^4.x"              // Управление состоянием (резерв)
}
```

---

## 🌙 Система тём (Dark/Light)

### Как использовать

**В любом компоненте:**

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className={isDark ? 'bg-dark text-white' : 'bg-white text-black'}>
      <button onClick={toggleTheme}>
        {isDark ? '☀️ Светлый' : '🌙 Тёмный'}
      </button>
    </div>
  );
}
```

### Особенности

✅ Автоматическое сохранение в localStorage  
✅ Синхронизация с системными предпочтениями  
✅ Плавные переходы между темами  
✅ CSS классы с `dark:` префиксом Tailwind  

### Пример в Layout

Переключатель темы уже встроен в навигацию (☀️/🌙 кнопка в углу).

---

## 🔊 Звуковые эффекты

### Использование

```jsx
import { useSound } from './utils/soundManager';

function MyButton() {
  const { play, playTone } = useSound();
  
  return (
    <button onClick={() => playTone(600, 100, 0.3)}>
      Клик со звуком
    </button>
  );
}
```

### API Звуков

#### `playTone(frequency, duration, volume)`

| Параметр | Тип | Значение | Пример |
|----------|-----|----------|--------|
| frequency | Hz | Частота звука | 440 (ля), 600 (мидл), 800 (выс) |
| duration | ms | Длительность | 50-200 ms |
| volume | 0-1 | Громкость | 0.2-0.3 (не громко) |

### Примеры тонов

```javascript
// Низкий тон (оошибка)
playTone(300, 200, 0.2);

// Средний тон (действие)
playTone(600, 100, 0.25);

// Высокий тон (успех)
playTone(800, 100, 0.3);

// Мелодия
playTone(400, 200, 0.3); // Первая нота
playTone(600, 200, 0.3); // Вторая нота
playTone(800, 200, 0.3); // Третья нота
```

---

## ✨ SVG Анимированные иконки

### Доступные иконки

#### 1. AnimatedLogo
```jsx
<AnimatedLogo className="w-12 h-12" />
```
- Анимированный лого с масштабированием
- Использует в Layout для навигации

#### 2. AnimatedHeartIcon
```jsx
<AnimatedHeartIcon filled={true} className="w-6 h-6" />
```
- Пульсирует при `filled={true}`
- Идеален для кнопок "Нравится"

#### 3. AnimatedStarIcon
```jsx
<AnimatedStarIcon active={true} className="w-6 h-6" />
```
- Вращается при `active={true}`
- Для рейтингов и отзывов

#### 4. AnimatedArrowIcon
```jsx
<AnimatedArrowIcon direction="right" className="w-6 h-6" />
<!-- direction: 'right' | 'down' | 'left' | 'up' -->
```
- Движущаяся стрелка
- Анимация вверх-вниз по оси направления

### Особенности иконок

- Масштабирование при hover (`whileHover={{ scale: 1.2 }}`)
- Сжатие при клике (`whileTap={{ scale: 0.95 }}`)
- Гладкие spring анимации

---

## 🔘 Анимированные кнопки

### 1. AnimatedButton (Базовая)

```jsx
<AnimatedButton 
  variant="primary"  // primary | secondary | success | danger
  size="md"          // sm | md | lg
  withSound={true}
  onClick={() => {}}
>
  Нажми меня
</AnimatedButton>
```

**Эффекты:**
- Ripple эффект при клике
- Масштабирование при hover/tap
- Звуковой feedback (опционально)

### 2. PulseButton (Пульсирующая)

```jsx
<PulseButton onClick={() => {}}>
  Важная кнопка
</PulseButton>
```

**Эффекты:**
- Постоянное пульсирующее свечение
- Градиент от фиолетового к розовому

### 3. LoadingButton (С загрузкой)

```jsx
const [isLoading, setIsLoading] = useState(false);

<LoadingButton 
  isLoading={isLoading}
  onClick={async () => {
    setIsLoading(true);
    await fetch('/api/submit');
    setIsLoading(false);
  }}
>
  Отправить
</LoadingButton>
```

**Эффекты:**
- Вращающийся спиннер при загрузке
- Блокировка клика во время загрузки

### 4. TooltipButton (С подсказкой)

```jsx
<TooltipButton 
  tooltip="Это подсказка для пользователя!"
  onClick={() => {}}
>
  Наведи на меня
</TooltipButton>
```

**Эффекты:**
- Подсказка появляется при наведении
- Гладкая анимация появления/исчезновения

---

## 📜 Scroll-trigger эффекты

### 1. ScrollReveal (Появление при скролле)

```jsx
<ScrollReveal direction="up" delay={0.2}>
  <h1>Заголовок</h1>
</ScrollReveal>
```

**Направления:** `up | down | left | right`  
**Задержка:** `0` - `1` (в секундах)

### 2. ScrollScale (Масштабирование)

```jsx
<ScrollScale>
  <div>Элемент с масштабированием</div>
</ScrollScale>
```

Элемент масштабируется из 0.8 до 1 при скролле в видимость.

### 3. ScrollRotate (Вращение)

```jsx
<ScrollRotate>
  <div>Вращающийся элемент</div>
</ScrollRotate>
```

Вращается на 360° в зависимости от позиции скролла.

### 4. Parallax (Параллакс эффект)

```jsx
<Parallax offset={100}>
  <img src="..." alt="..." />
</Parallax>
```

Элемент движется медленнее, чем скролл (классический параллакс).

### 5. CountUp (Счётчик)

```jsx
<CountUp from={0} to={1000} duration={2} />
```

Анимированный счётчик от одного числа к другому.

### 6. AosReveal (Используя AOS)

```jsx
<AosReveal animation="fade-up" duration={800}>
  <div>Элемент</div>
</AosReveal>
```

**Популярные AOS анимации:**
- `fade-up` / `fade-down` / `fade-left` / `fade-right`
- `zoom-in` / `zoom-out`
- `flip-up` / `flip-down`
- `slide-up` / `slide-down`
- `bounce` / `pulse`

---

## 📚 Примеры использования

### Пример 1: Hero секция с анимациями

```jsx
import { motion } from 'framer-motion';
import { ScrollReveal } from './components/ScrollAnimations';
import { AnimatedButton } from './components/AnimatedButtons';
import { soundManager } from './utils/soundManager';

export const Hero = () => {
  return (
    <ScrollReveal direction="up">
      <section className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6">Добро пожаловать</h1>
          <p className="text-xl mb-8 text-gray-600">
            Это текст с красивыми анимациями
          </p>
          
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={() => soundManager.playTone(600, 100, 0.3)}
          >
            Начать
          </AnimatedButton>
        </motion.div>
      </section>
    </ScrollReveal>
  );
};
```

### Пример 2: Карточка товара

```jsx
import { motion } from 'framer-motion';
import { ScrollScale, Parallax } from './components/ScrollAnimations';
import { AnimatedHeartIcon } from './components/AnimatedIcons';
import { useState } from 'react';
import { soundManager } from './utils/soundManager';

export const ProductCard = ({ image, title, price }) => {
  const [liked, setLiked] = useState(false);

  return (
    <ScrollScale>
      <Parallax offset={50}>
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          whileHover={{ y: -10 }}
          transition={{ type: 'spring' }}
        >
          <img src={image} alt={title} className="w-full h-48 object-cover" />
          
          <div className="p-6">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-2xl font-bold mb-4">${price}</p>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setLiked(!liked);
                  soundManager.playTone(800, 100, 0.3);
                }}
              >
                <AnimatedHeartIcon filled={liked} className="w-6 h-6" />
              </motion.button>
              
              <AnimatedButton variant="primary" className="flex-1">
                Купить
              </AnimatedButton>
            </div>
          </div>
        </motion.div>
      </Parallax>
    </ScrollScale>
  );
};
```

### Пример 3: Форма с валидацией

```jsx
import { motion } from 'framer-motion';
import { LoadingButton } from './components/AnimatedButtons';
import { soundManager } from './utils/soundManager';
import { useState } from 'react';

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Отправка на сервер
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        soundManager.playTone(800, 200, 0.3); // Успех
        setEmail('');
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (err) {
      soundManager.playTone(300, 200, 0.2); // Ошибка
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto space-y-4"
    >
      <motion.div
        animate={error ? { x: [-10, 10, -10, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ваш email"
          className={`w-full px-4 py-2 border rounded-lg ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500"
        >
          {error}
        </motion.p>
      )}

      <LoadingButton isLoading={loading} type="submit">
        Отправить
      </LoadingButton>
    </motion.form>
  );
};
```

---

## 📂 Структура проекта

```
src/
├── context/
│   └── ThemeContext.jsx          # Dark/Light режим
│
├── components/
│   ├── AnimatedIcons.jsx         # SVG иконки
│   ├── AnimatedButtons.jsx       # Кнопки с эффектами
│   ├── ScrollAnimations.jsx      # Scroll-trigger
│   ├── Layout.jsx                # С темой и анимациями
│   ├── AnimatedSection.jsx       # Готовый компонент
│   └── ...
│
├── utils/
│   └── soundManager.js           # Управление звуками
│
├── pages/
│   ├── Home.jsx                  # С анимациями
│   ├── AnimationsShowcase.jsx    # 👈 Полная демонстрация
│   └── ...
│
└── App.jsx                       # С ThemeProvider
```

---

## 🎮 Демо страница

Посетите `/animations` чтобы увидеть все компоненты в действии:

```
http://localhost:5173/animations
```

На этой странице вы найдёте:
- ✨ SVG иконки с анимациями
- 🔘 Все типы кнопок
- 📜 Scroll-trigger эффекты
- 🎯 Интерактивные демонстрации
- 🔊 Звуковые эффекты

---

## 🛠️ Разработка

### Запуск локально

```bash
npm install
npm run dev
```

Откройте `http://localhost:5173` в браузере.

### Сборка для продакшена

```bash
npm run build
npm run preview
```

---

## 📖 Полная документация

Смотрите [ANIMATIONS.md](./ANIMATIONS.md) для детального руководства по каждому компоненту.

---

## 💡 Советы по использованию

1. **Звуки:** Используйте низкую громкость (0.2-0.3), чтобы не раздражать пользователя
2. **Анимации:** Длительность 200-800ms для оптимальной UX
3. **Доступность:** Проверяйте `prefers-reduced-motion` для доступности
4. **Производительность:** Избегайте одновременных сложных анимаций на разных элементах
5. **Тёмный режим:** Адаптируйте цвета с `isDark` хуком для лучшего контраста

---

## 🚀 Что дальше?

Идеи для расширения:

- [ ] Добавить Lottie анимации для более сложных эффектов
- [ ] Реализовать 3D трансформации (three.js)
- [ ] Добавить жесты для мобильных (Framer Motion gestures)
- [ ] Page transition анимации при смене маршрутов
- [ ] Confetti эффекты для успешных событий
- [ ] Video background с паузой при скролле
- [ ] Музыка для фонового эффекта

---

**Создано с ❤️ для идеального пользовательского опыта**
