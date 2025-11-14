# ExploreX ✈️

<div align="center">

**Your Gateway to Unforgettable Adventures**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express)](https://expressjs.com/)

*One Platform. Infinite Possibilities. Seamless Travel Experience.*

</div>

---

## 🎯 What is ExploreX?

ExploreX is a **comprehensive, all-in-one travel and tourism platform** that revolutionizes how travelers plan, book, and experience their journeys. Whether you're planning a weekend getaway or an international adventure, ExploreX brings together everything you need in one seamless, user-friendly platform.

### Why Choose ExploreX?

✨ **Complete Travel Solution** - From flights to events, everything in one place  
🚀 **Lightning Fast** - Built with modern technologies for optimal performance  
🔒 **Secure & Reliable** - Enterprise-grade security with JWT authentication  
📱 **Responsive Design** - Works flawlessly on desktop, tablet, and mobile  
🎨 **Beautiful UI** - Modern, intuitive interface built with Tailwind CSS  
👥 **Multi-Role Support** - Perfect for travelers, vendors, and administrators  

---

## 🌟 Key Features & Highlights

### 🎁 Core Services

#### ✈️ **Flight Booking**
- Search and compare flights from multiple airlines
- Real-time availability and pricing
- Easy booking and reservation management
- Flight tracking and updates

#### 🏨 **Hotel Reservations**
- Browse thousands of hotels worldwide
- Filter by price, location, amenities, and ratings
- Instant booking confirmation
- Manage your hotel bookings in one place

#### 📅 **Holiday Packages**
- Curated holiday packages for every budget
- All-inclusive deals (flights + hotels + activities)
- Customizable package options
- Special seasonal offers

#### 🛍️ **Travel Shopping**
- Shop for travel essentials before your trip
- Local souvenirs and gifts
- Travel gear and accessories
- Secure checkout and delivery options

#### 🗺️ **Local Guides**
- Connect with experienced local guides
- Book guided tours and experiences
- Read reviews and ratings
- Personalized travel recommendations

#### 💱 **Currency Exchange**
- Real-time exchange rates
- Currency conversion calculator
- Multiple currency support
- Secure transaction processing

#### 🎉 **Events & Activities**
- Discover local events and festivals
- Book tickets for concerts, shows, and events
- Event recommendations based on your location
- Calendar integration for event planning

### 👥 User Roles & Capabilities

#### 👤 **Travelers (Users)**
- **Browse & Search**: Explore all available services with advanced search filters
- **Book Services**: Make reservations for flights, hotels, packages, and more
- **Manage Bookings**: View, modify, or cancel bookings from your dashboard
- **Profile Management**: Update personal information and preferences
- **Booking History**: Access complete history of all your bookings
- **Premium Features**: Upgrade to premium for exclusive benefits

#### 🏢 **Vendors (Service Providers)**
- **Dashboard Access**: Comprehensive vendor dashboard with analytics
- **Service Management**: Add, edit, and manage your service offerings
- **Booking Management**: View and respond to customer bookings
- **Performance Tracking**: Monitor your service performance and reviews
- **Multi-Service Support**: Manage flights, hotels, guides, events, and more
- **Real-time Updates**: Get instant notifications for new bookings

#### 👨‍💼 **Administrators**
- **User Management**: Manage all users, vendors, and their accounts
- **Vendor Approval**: Review and approve new vendor registrations
- **Platform Analytics**: Monitor platform usage and performance metrics
- **Content Moderation**: Ensure quality and security across the platform
- **System Configuration**: Configure platform settings and features
- **Support Tools**: Access customer support and issue resolution tools

### 🚀 Advanced Features

#### 🔐 **Security & Authentication**
- **JWT-Based Authentication**: Secure token-based authentication system
- **Password Encryption**: bcryptjs hashing for maximum security
- **Role-Based Access Control**: Granular permissions for different user types
- **Session Management**: Secure session handling and token refresh
- **Input Validation**: Joi validation to prevent malicious inputs

#### 🎨 **User Experience**
- **Modern UI/UX**: Beautiful, intuitive interface designed with Tailwind CSS
- **Responsive Design**: Seamless experience across all devices
- **Fast Performance**: Optimized with Vite for lightning-fast load times
- **Search Functionality**: Advanced search with filters and sorting
- **Real-time Updates**: Live updates for bookings and availability
- **Toast Notifications**: User-friendly notification system

#### 📊 **Management Features**
- **Booking System**: Complete booking lifecycle management
- **Profile Management**: Comprehensive user profile system
- **Dashboard Analytics**: Real-time statistics and insights
- **Multi-vendor Support**: Support for multiple service providers
- **Calendar Integration**: Week calendar view for bookings
- **Debounce Search**: Optimized search with debouncing

### 💡 What Makes ExploreX Special?

🎯 **All-in-One Platform** - No need to switch between multiple apps or websites  
⚡ **Lightning Fast** - Built with React 19 and Express 5 for optimal performance  
🔒 **Enterprise Security** - Bank-level security with JWT and encrypted passwords  
📱 **Mobile First** - Responsive design that works perfectly on any device  
🎨 **Beautiful Design** - Modern, clean interface that's a joy to use  
🌍 **Global Reach** - Support for international travel and multiple currencies  
🤝 **Vendor Friendly** - Easy-to-use dashboard for service providers  
👨‍💼 **Admin Control** - Comprehensive admin panel for platform management

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (JSON Web Tokens)** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ExploreXv1.0/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── admin/        # Admin dashboard components
│   │   ├── Client/       # User-facing components
│   │   │   ├── Services/ # Service pages (Flights, Hotels, etc.)
│   │   │   ├── Bookings/ # Booking management
│   │   │   └── Profile/  # User profile
│   │   ├── Vendor/       # Vendor dashboard components
│   │   ├── api/          # API client and authentication
│   │   └── components/   # Reusable components
│   └── package.json
│
├── server/               # Node.js backend application
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── Routes/          # API routes
│   ├── middleware/     # Custom middleware
│   └── server.js        # Entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExploreXv1.0
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm start
   # or for development with auto-reload
   npx nodemon server.js
   ```
   The server will run on `http://localhost:5000`

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (default Vite port)

## 📡 API Endpoints

The API is prefixed with `/api/v1`

### User Routes (`/api/v1/users`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Vendor Routes (`/api/v1/vendors`)
- `POST /register` - Vendor registration
- `POST /login` - Vendor login
- `GET /dashboard` - Vendor dashboard data
- CRUD operations for vendor services

### Admin Routes (`/api/v1/admins`)
- `POST /register` - Admin registration
- `POST /login` - Admin login
- `GET /vendors` - Get all vendors
- `POST /vendors` - Add new vendor
- `GET /users` - Get all users

## 🎯 Usage

1. **As a User:**
   - Register/Login to access the platform
   - Browse available services (flights, hotels, etc.)
   - Book services and manage your bookings
   - Update your profile information

2. **As a Vendor:**
   - Register/Login to vendor dashboard
   - Manage your service offerings
   - View and respond to bookings

3. **As an Admin:**
   - Login to admin dashboard
   - Manage users and vendors
   - Monitor platform activities

## 🔒 Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation using Joi
- CORS configuration for secure API access

## 📝 Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd server
node server.js   # Start server
# or
npx nodemon server.js  # Start with auto-reload
```

## 📸 Screenshots & Demo

> **Note**: Screenshots and demo links coming soon! Check back for visual previews of the platform.

### 🎬 What You Can Expect

- **Beautiful Homepage** - Stunning landing page with service cards and search functionality
- **User Dashboard** - Clean, intuitive interface for managing bookings and profile
- **Vendor Dashboard** - Comprehensive analytics and service management tools
- **Admin Panel** - Powerful admin interface for platform management
- **Service Pages** - Detailed service listings with filters and booking options
- **Responsive Design** - Seamless experience on all devices

## 🎯 Use Cases

### For Travelers
- **Plan Your Dream Trip** - Book flights, hotels, and activities all in one place
- **Save Time & Money** - Compare prices and find the best deals
- **Manage Everything** - Keep track of all your bookings in one dashboard
- **Discover New Places** - Find local guides, events, and experiences

### For Vendors
- **Reach More Customers** - List your services on a popular platform
- **Manage Easily** - Simple dashboard to manage bookings and services
- **Track Performance** - Analytics to understand your business better
- **Grow Your Business** - Connect with travelers from around the world

### For Administrators
- **Platform Control** - Complete control over users, vendors, and content
- **Monitor Activity** - Track platform usage and performance
- **Ensure Quality** - Moderate content and ensure security
- **Scale Easily** - Built to handle growth and scale

## 🚀 Getting Started is Easy!

1. **Sign Up** - Create your account in seconds
2. **Explore** - Browse available services
3. **Book** - Make your first booking
4. **Enjoy** - Start your adventure!

## 🌟 Why Developers Love ExploreX

- **Modern Stack** - Built with the latest technologies (React 19, Express 5, MongoDB)
- **Clean Code** - Well-structured, maintainable codebase
- **Scalable Architecture** - Designed to handle growth
- **Best Practices** - Follows industry standards and best practices
- **Documentation** - Comprehensive documentation for easy onboarding
- **Open Source** - Contribute and help improve the platform

## 📈 Roadmap & Future Features

- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Payment Integration** - Multiple payment gateway support
- [ ] **Reviews & Ratings** - User reviews and rating system
- [ ] **Chat Support** - Real-time customer support chat
- [ ] **Email Notifications** - Automated email notifications
- [ ] **Social Login** - Login with Google, Facebook, etc.
- [ ] **Multi-language Support** - Support for multiple languages
- [ ] **Advanced Analytics** - Enhanced analytics and reporting
- [ ] **API Documentation** - Comprehensive API documentation
- [ ] **Webhooks** - Webhook support for integrations

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes ExploreX better for everyone.

### How to Contribute

1. **Fork the Repository** - Create your own fork of the project
2. **Create a Branch** - Make a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. **Make Changes** - Implement your changes with clean, documented code
4. **Test Thoroughly** - Ensure your changes work correctly
5. **Commit Changes** - Commit with clear, descriptive messages
6. **Push to Branch** - Push your changes to your fork
7. **Open Pull Request** - Submit a pull request with a detailed description

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

## 👥 Authors & Contributors

- **ExploreX Development Team** - Initial work and ongoing development

### Special Thanks

Thank you to all contributors who have helped make ExploreX better!

## 📧 Support & Contact

### Get Help

- **GitHub Issues** - Report bugs or request features
- **Documentation** - Check the documentation for answers
- **Community** - Join our community discussions

### Stay Connected

- **Star the Repo** - Show your support by starring the repository
- **Watch for Updates** - Get notified of new releases
- **Share with Friends** - Help spread the word about ExploreX

## 🎉 Show Your Support

If you find ExploreX helpful, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** the project
- 🐛 **Reporting** bugs
- 💡 **Suggesting** new features
- 📝 **Improving** documentation
- 🤝 **Contributing** code

---

<div align="center">

### 🌍 Start Your Adventure Today!

**ExploreX** - *Your Gateway to Unforgettable Adventures*

[Get Started](#-getting-started) • [View Features](#-key-features--highlights) • [Contribute](#-contributing)

---

**Made with ❤️ by the ExploreX Team**

**Happy Traveling! ✈️🌍🎉**

</div>

