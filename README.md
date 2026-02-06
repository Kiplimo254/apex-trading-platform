# Apex Trade - Crypto Investment Platform

A full-stack cryptocurrency investment and trading platform built with React, Node.js, Express, and Prisma.

## Features

### Phase 1: Crypto Markets Display ✅
- Live cryptocurrency prices from CoinGecko API
- Market overview with search and filtering
- Individual coin detail pages with price charts
- Watchlist functionality
- Real-time price updates

### Phase 2: Trading Bots ✅
- 4 trading strategies (Grid, DCA, Momentum, Mean Reversion)
- Bot showcase with detailed information
- Admin-mediated bot activation
- WhatsApp/Telegram contact integration
- User bot management and performance tracking

### Phase 3: Account Management (Planned)
- Manual portfolio tracker
- Trade journal
- P&L analytics
- Performance charts

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- TailwindCSS
- Recharts for data visualization
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT authentication
- Axios for API calls

## Project Structure

```
apex/
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   ├── middleware/ # Auth, error handling
│   │   └── config/   # Database, environment
│   ├── prisma/       # Database schema & migrations
│   └── package.json
│
└── fronted/          # React frontend
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/ # Reusable components
    │   └── lib/      # Utilities
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/apex-trade.git
cd apex-trade
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
# Create .env file in backend/
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Install frontend dependencies:
```bash
cd ../fronted
npm install
```

6. Set up frontend environment:
```bash
# Create .env file in fronted/
cp .env.example .env
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

2. Start the frontend (in a new terminal):
```bash
cd fronted
npm run dev
# App runs on http://localhost:8081
```

3. Access the application at `http://localhost:8081`

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_here
PORT=5000
CORS_ORIGIN=http://localhost:8081
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_WHATSAPP=+1234567890
VITE_ADMIN_TELEGRAM=@apex_admin
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Markets
- `GET /api/markets` - Get cryptocurrency list
- `GET /api/markets/:coinId` - Get coin details
- `GET /api/markets/:coinId/chart` - Get price chart data

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add coin to watchlist
- `DELETE /api/watchlist/:coinId` - Remove from watchlist

### Trading Bots
- `GET /api/bots/strategies` - List available strategies
- `GET /api/bots/my-bots` - Get user's bots
- `POST /api/bots/request` - Request bot activation

### Admin
- `GET /api/admin/users` - Manage users
- `GET /api/admin/transactions` - View transactions
- `POST /api/admin/bots` - Create bot for user

## Database Schema

Key models:
- **User** - User accounts with authentication
- **Investment** - User investments
- **Transaction** - Deposits and withdrawals
- **Watchlist** - Saved cryptocurrency watchlist
- **TradingBot** - Automated trading bots
- **BotTrade** - Bot trade history
- **Portfolio** - User holdings (Phase 3)
- **Trade** - Manual trade journal (Phase 3)

## Development

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

## Deployment

### Backend
1. Set production environment variables
2. Run `npm run build`
3. Deploy to hosting service (Railway, Render, etc.)

### Frontend
1. Update API URL in .env
2. Run `npm run build`
3. Deploy dist/ folder to Vercel, Netlify, etc.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact the admin team via:
- WhatsApp: +1234567890
- Telegram: @apex_admin

## Acknowledgments

- CoinGecko API for cryptocurrency data
- Recharts for beautiful charts
- Prisma for database management
