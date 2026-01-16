# Emerald Stay - Yield Simulator

A web app that calculates property investment returns over 3 years using predictions based on historical booking data.

## Getting Started

```bash
# Clone and install
git clone <repo>
cd emerald-yield-simulator
npm install

# Set up environment
cp .env.example .env

# Run with Docker
docker-compose up -d

# OR run locally
npm run dev
```

Access at: http://localhost:3000

## Routes

**Pages**

- `GET /` - Simulation form
- `GET /admin` - View all simulations

**API**

- `POST /api/simulation` - Create new simulation
- `GET /api/admin/simulations` - List all simulations

**Example Request:**

```json
POST /api/simulation
{
  "purchasePrice": 250000,
  "monthlyRent": 1500,
  "annualRentalFee": 1200,
  "prospectEmail": "test@example.com",
  "surface": 65,
  "bedrooms": 2,
  "locationScore": 8.5
}
```

## Tests

```bash
npm test
```

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- EJS + Bootstrap 5
- Docker
