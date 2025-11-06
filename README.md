# example-playwright

End-to-end testing suite for a ticket booking application using Playwright. This project tests complete booking workflows including seat selection, unlock code validation, and payment processing.

## Prerequisites

- Node.js (v18 or higher)
- pnpm 10.12.1 or higher
- The ticket booking application running locally

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Install Playwright browsers:
```bash
pnpm exec playwright install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
EMAIL=your-test-email@example.com
PASSWORD=your-test-password
BASE_URL=http://localhost:3000
```

Use `.env.example` as a template.

## Running Tests

```bash
# Run all tests
pnpm test:e2e

# Run tests in UI mode (interactive)
pnpm test:e2e:ui

# Generate tests using Codegen
pnpm test:e2e:codegen

# View HTML test report
pnpm test:e2e:report
```

## Test Cases

### Seat-based Event Booking (`tests/seat.spec.ts`)

Tests the complete booking flow for events with seat selection:

1. **Complete Ticket Booking Flow**
   - User login
   - Event selection
   - Showtime selection
   - Seat selection using Konva canvas
   - Ticket type selection
   - Payment via PromptPay
   - Order confirmation

2. **Unlock Code Validation - Showtime Level**
   - Tests unlock code requirement at the showtime level
   - Validates code entry and acceptance
   - Proceeds with seat selection after validation

3. **Unlock Code Validation - Ticket Type Level**
   - Tests unlock code requirement at the ticket-type level
   - Validates code entry for specific ticket types
   - Completes booking with validated ticket types

### Non-seat Event Booking (`tests/none-seat.spec.ts`)

Tests the booking flow for events without seat selection:

1. **Complete Ticket Booking Flow**
   - User login
   - Event selection
   - Event date/time selection
   - Quantity-based ticket selection
   - Ticket type selection
   - Payment via PromptPay
   - Order confirmation

2. **Unlock Code Validation - Event Level**
   - Tests unlock code requirement at the event level
   - Validates code entry and acceptance
   - Proceeds with ticket selection after validation

3. **Unlock Code Validation - Ticket Type Level**
   - Tests unlock code requirement for specific ticket types
   - Validates code entry during ticket selection
   - Completes booking with validated tickets

## Project Structure

```
example-playwright/
├── tests/
│   ├── seat.spec.ts          # Seat-based event booking tests
│   ├── none-seat.spec.ts     # Non-seat event booking tests
│   └── utils/
│       └── utils.ts          # Helper utilities for seat selection
├── playwright.config.ts      # Playwright configuration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in git)
└── .env.example             # Environment template
```

## Tech Stack

- **Playwright** - E2E testing framework
- **Konva** - Canvas library for seat visualization
- **TypeScript** - Type-safe test code
- **dotenv** - Environment configuration

## License

ISC
