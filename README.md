# 🚗 Luxe Detail - Premium Automotive Detailing Platform

> Modern web application for premium automotive detailing services featuring precision paint correction, ceramic coating, and comprehensive booking system.

![Luxe Detail](docs/screenshots/home-page.png)

---

## ✨ Features

### 🎨 User Experience

- **Dark/Light Theme** - Smooth theme switching with system preference detection
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Modern Animations** - Powered by Framer Motion for fluid interactions
- **PWA Support** - Installable on mobile devices for app-like experience

### 💼 Core Functionality

- **Service Calculator** - Dynamic pricing based on vehicle type and condition
- **Online Booking** - Calendar-based appointment scheduling
- **Dashboard** - Service history and upcoming appointments
- **Gallery** - Before/after transformations with interactive sliders
- **Save Configurations** - Store and restore service preferences

### ⚡ Performance

- **Code Splitting** - Lazy-loaded routes for faster initial load
- **Optimized Bundle** - ~101KB (gzip) main bundle
- **Error Boundaries** - Graceful handling of component failures
- **Service Worker** - Offline support and caching

---

## 🛠️ Tech Stack

| Category | Technologies |
| -------- | ------------ |
| **Frontend** | React 19, Vite 7, React Router 7 |
| **Styling** | Tailwind CSS 3, Custom CSS |
| **Animations** | Framer Motion 12 |
| **State** | Zustand 5 |
| **Audio** | Howler.js |
| **Backend** | Express 5, Neon PostgreSQL |
| **Deployment** | Vercel (Frontend), Neon (Database) |

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/luxe-detail.git
cd luxe-detail

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run development server
npm run dev

# Run both frontend and backend
npm run dev:both
```

---

## 🚀 Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run dev:server` | Start Express backend (port 3000) |
| `npm run dev:both` | Run frontend + backend concurrently |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run migrate` | Run database migrations |

---

## 📁 Project Structure

```
luxe-detail/
├── public/
│   └── manifest.json         # PWA manifest
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── Layout.jsx        # Main layout with nav
│   │   └── ErrorBoundary.jsx # Error handling
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Gallery.jsx
│   │   ├── Calculator.jsx
│   │   ├── Booking.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx      # 404 page
│   ├── context/
│   │   ├── ThemeContext.jsx  # Dark/light theme
│   │   └── ToastContext.jsx  # Notifications
│   ├── store/
│   │   └── useBookingStore.js # Zustand state
│   ├── utils/
│   │   ├── formatters.js     # Date/number formatting
│   │   ├── polyfills.js      # Browser compatibility
│   │   └── soundManager.js   # Audio effects
│   └── data/
│       └── mockData.js       # Demo data
├── api/                      # Backend routes
├── db/                       # Database migrations
├── docs/                     # Documentation & screenshots
└── tests/                    # Unit tests
```

---

## 🎯 Key Features Deep Dive

### Service Calculator

Dynamic pricing engine that calculates costs based on:

- Vehicle type (Sedan, SUV, Sport, Luxury)
- Paint condition (Pristine, Light Wear, Heavy Correction)
- Service modules (Ceramic Coating, Paint Correction, Interior Detail)

### Booking System

- Visual calendar with date selection
- Time slot picker with availability
- Package selection integration
- Form validation with real-time feedback
- Email confirmations (backend integration)

### Gallery

- Before/after slider comparisons
- Categorized transformations
- Lazy-loaded images for performance
- Smooth animations on scroll

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# Email (Optional - for booking confirmations)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# Analytics (Optional)
PLAUSIBLE_DOMAIN=yourdomain.com
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 📊 Performance Metrics

| Metric | Score |
| ------ | ----- |
| Lighthouse Performance | 95+ |
| Bundle Size (gzip) | 101 KB |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.0s |
| PWA Score | 100/100 |

---

## 🚧 Roadmap

- [ ] TypeScript migration
- [ ] Internationalization (i18n)
- [ ] Payment integration (Stripe)
- [ ] Customer reviews system
- [ ] Admin panel for bookings
- [ ] Email templates
- [ ] SMS notifications

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📧 Contact

- Website: <https://luxedetail.com>
- Email: <info@luxedetail.com>
- Twitter: [@luxedetail](https://twitter.com/luxedetail)

---

### Made with ❤️ by the Luxe Detail Team
