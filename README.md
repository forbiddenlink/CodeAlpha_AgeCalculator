# 🎂 Age Calculator Pro

A modern, accessible, and feature-rich age calculator built with vanilla JavaScript. Calculate your exact age with beautiful visualizations, statistics, fun facts, and more!

![Age Calculator Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=Age+Calculator+Pro)

## ✨ Features

### Core Functionality
- **Precise Age Calculation**: Calculate age in years, months, and days
- **Multiple Input Methods**: Manual entry or date picker
- **Real-time Validation**: Instant feedback on date inputs
- **Error Handling**: Comprehensive error messages and recovery

### Advanced Features
- **🌍 Planetary Ages**: See your age on other planets
- **📊 Detailed Statistics**: Total days, hours, heartbeats, and more
- **🎯 Fun Facts**: Personalized insights about your age
- **🎉 Upcoming Milestones**: Track upcoming birthdays and milestones
- **📅 Historical Events**: What happened in your birth year

### User Experience
- **🎨 Beautiful Design**: Modern glassmorphism UI with smooth animations
- **🌙 Dark/Light Mode**: Automatic or manual theme switching
- **⚙️ User Preferences**: Customizable settings and preferences
- **📱 Progressive Web App**: Install and use offline
- **♿ Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **📤 Sharing**: Share results as text, image, or JSON

### Technical Excellence
- **⚡ Performance**: Optimized for Core Web Vitals
- **🔒 Security**: Input sanitization and validation
- **📊 Analytics**: Built-in performance monitoring
- **🧪 Tested**: Comprehensive test suite with 100% pass rate
- **🏗️ Modern Stack**: ES6+ modules, Vite, Vitest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Modern browser with ES6+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/forbiddenlink/CodeAlpha_AgeCalculator.git
   cd CodeAlpha_AgeCalculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:4567`

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |
| `npm run analyze` | Analyze bundle size |

## 📁 Project Structure

```
age-calculator/
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/                   # Source files (implicit)
│   ├── AgeCalculator.js  # Core calculation logic
│   ├── UIManager.js      # UI management
│   ├── ThemeManager.js   # Theme handling
│   ├── ValidationHelper.js # Input validation
│   ├── ErrorHandler.js   # Error management
│   ├── PerformanceMonitor.js # Performance tracking
│   ├── UserPreferences.js # Settings management
│   └── AccessibilityHelper.js # A11y utilities
├── tests/                 # Test files
├── index.html            # Main HTML file
├── styles.css            # Styling
├── script.js             # Main application
└── vite.config.js        # Vite configuration
```

## 🎯 Usage

### Basic Usage

1. **Choose Input Method**: Select manual entry or date picker
2. **Enter Birth Date**: Input your birth date
3. **Calculate**: Click "Calculate My Age" or use Ctrl+Enter
4. **View Results**: See your age with statistics and fun facts

### Advanced Features

#### Settings Panel
- Click the ⚙️ settings button to customize:
  - Theme preferences
  - Input method defaults
  - Display options
  - Accessibility settings

#### Keyboard Shortcuts
- `Ctrl/Cmd + D`: Toggle theme
- `Ctrl/Cmd + Enter`: Calculate age
- `Escape`: Clear form
- `Ctrl + Shift + P`: Show performance dashboard (dev mode)

#### Sharing Options
- **Text**: Copy formatted text to clipboard
- **Image**: Export as PNG image
- **JSON**: Export data as JSON file

## 🧪 Testing

The project includes comprehensive tests covering:

- ✅ Core age calculation logic
- ✅ Edge cases (leap years, invalid dates)
- ✅ Input validation and sanitization
- ✅ UI interactions and accessibility
- ✅ Performance requirements
- ✅ Integration workflows

Run tests with:
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
```

## 🎨 Customization

### Themes
The app supports automatic theme detection and manual switching between light and dark modes. Themes are built with CSS custom properties for easy customization.

### User Preferences
All user settings are stored in localStorage and include:
- Theme preferences
- Input method defaults
- Feature toggles
- Accessibility options

### Extending Features
The modular architecture makes it easy to add new features:

1. Create your feature module
2. Import and initialize in `script.js`
3. Add tests for your feature
4. Update documentation

## 📊 Performance

### Core Web Vitals Targets
- **First Contentful Paint**: < 2.0s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

### Bundle Size
- **Main bundle**: ~15KB gzipped
- **CSS**: ~8KB gzipped
- **Total initial load**: ~25KB gzipped

## ♿ Accessibility

This project follows WCAG 2.1 AA guidelines and includes:

- ✅ Semantic HTML structure
- ✅ ARIA labels and descriptions
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast mode support
- ✅ Reduced motion preferences
- ✅ Focus management

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📱 Progressive Web App

Install the app for:
- ✅ Offline functionality
- ✅ Native app experience
- ✅ Desktop/mobile installation
- ✅ Background sync (future)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Elizabeth Stein**
- GitHub: [@forbiddenlink](https://github.com/forbiddenlink)
- Project: [CodeAlpha_AgeCalculator](https://github.com/forbiddenlink/CodeAlpha_AgeCalculator)

## 🙏 Acknowledgments

- [CodeAlpha](https://www.codealpha.tech) for the internship opportunity
- [date-fns](https://date-fns.org/) for robust date manipulation
- [Vite](https://vitejs.dev/) for blazing fast development
- The open-source community for inspiration and tools

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Export to calendar apps
- [ ] Social media integration
- [ ] Age comparison tools
- [ ] Custom milestone tracking
- [ ] Data visualization charts
- [ ] Backend sync for preferences

---

<div align="center">
  <strong>Made with ❤️ for CodeAlpha</strong>
  <br>
  <a href="https://agecalculator.dev">Live Demo</a> | 
  <a href="https://github.com/forbiddenlink/CodeAlpha_AgeCalculator/issues">Report Bug</a> | 
  <a href="https://github.com/forbiddenlink/CodeAlpha_AgeCalculator/issues">Request Feature</a>
</div>
