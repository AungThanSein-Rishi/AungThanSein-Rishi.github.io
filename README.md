# Aung Than Sein - Portfolio Website

A modern, responsive portfolio website showcasing my skills and experience as a Data Analyst and Business Intelligence Professional.

## 🚀 Features

- **Modern Architecture**: Modular JavaScript with ES6+ modules
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Performance Optimized**: Lazy loading, optimized assets, and modern CSS
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Interactive Elements**: Smooth carousels, form validation, and animations
- **Cross-browser Compatible**: Modern browsers with graceful degradation

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with CSS Variables, Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Modular architecture with classes and modules
- **Font Awesome**: Professional icons
- **Google Fonts**: Typography optimization

### Build Tools
- **ESBuild**: Fast JavaScript bundling and minification
- **Sass**: CSS preprocessing and organization
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

### External Services
- **EmailJS**: Contact form functionality
- **Google Analytics**: Performance and user behavior tracking

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
│   ├── images/            # Images and graphics
│   │   ├── profile_img/   # Profile pictures
│   │   ├── project_img/   # Project screenshots
│   │   └── achieve_cert/  # Achievement certificates
│   ├── icons/             # Icon files
│   └── documents/         # PDFs and documents
├── styles/                 # CSS organization
│   ├── base/              # Base styles and variables
│   │   ├── variables.css  # CSS custom properties
│   │   └── reset.css      # CSS reset and base styles
│   ├── components/        # Component-specific styles
│   │   ├── navigation.css # Navigation styles
│   │   ├── hero.css       # Hero section styles
│   │   ├── sections.css   # Section layouts
│   │   ├── projects.css   # Project carousel styles
│   │   ├── achievements.css # Achievements gallery styles
│   │   ├── contact.css    # Contact form styles
│   │   ├── footer.css     # Footer styles
│   │   └── utilities.css  # Utility classes
│   └── main.css           # Main CSS file with imports
├── scripts/                # JavaScript modules
│   ├── utils/              # Utility classes
│   │   ├── state-manager.js    # Application state management
│   │   └── error-handler.js    # Centralized error handling
│   ├── modules/            # Feature modules
│   │   ├── navigation.js       # Navigation functionality
│   │   ├── carousel.js         # Carousel components
│   │   ├── contact-form.js     # Contact form handling
│   │   └── image-modal.js      # Image modal functionality
│   └── main.js             # Main application entry point
├── cv/                     # Resume and CV files
├── index.html              # Main portfolio page
├── project1.html           # Project detail pages
├── project2.html           # Project detail pages
├── project3.html           # Project detail pages
└── project4.html           # Project detail pages
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ats-portfolio.git
   cd ats-portfolio
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
   Navigate to `http://localhost:3000`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run dev` | Start dev server and open browser |
| `npm run build` | Build CSS and JavaScript |
| `npm run build:all` | Build all assets and copy files |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove build artifacts |
| `npm run deploy` | Build for production deployment |

## 🎨 Customization

### Colors and Theme
Edit `src/styles/base/variables.css` to customize:
- Color palette
- Typography
- Spacing
- Shadows and borders
- Transitions and animations

### Content
- Update personal information in `src/index.html`
- Replace images in `src/assets/images/`
- Modify project details and descriptions
- Update contact information and social links

### Styling
- Component styles are in `src/styles/components/`
- Utility classes in `src/styles/components/utilities.css`
- Responsive breakpoints defined in CSS variables

## 📱 Responsive Design

The portfolio is built with a mobile-first approach:

- **Mobile**: < 768px - Single column layout, touch-optimized
- **Tablet**: 768px - 1024px - Two-column grid, enhanced navigation
- **Desktop**: > 1024px - Full layout with hover effects and animations

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences
- Skip navigation links

## 🚀 Performance Optimizations

- CSS and JavaScript minification
- Image optimization and lazy loading
- Critical CSS inlining
- Efficient animations with CSS transforms
- Minimal JavaScript bundle size
- Optimized font loading

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Analytics and Tracking

- Google Analytics 4 integration
- Core Web Vitals monitoring
- Performance metrics tracking
- User interaction analytics
- Form submission tracking

## 🔧 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement in modular structure
   - Add proper error handling
   - Test across devices

2. **Code Quality**
   - Run `npm run lint` for code quality
   - Use `npm run format` for consistent formatting
   - Follow modular architecture patterns

3. **Testing**
   - Test responsive design across devices
   - Verify accessibility features
   - Check performance metrics
   - Validate form functionality

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: aungthansein993@gmail.com
- **LinkedIn**: [Your LinkedIn Profile]
- **Portfolio**: [Your Portfolio URL]

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- EmailJS for contact form functionality
- Modern CSS and JavaScript community

---

**Built with ❤️ and modern web technologies**

