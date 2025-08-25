# Imperium Law - Frontend

A modern legal database and analytics platform built with React, TypeScript, and Vite.

## Features

- **Company Database Views** - Browse and analyze legal firms, cable manufacturers, and other business entities
- **Legal Case Analytics** - Visualize case durations, foreclosure data, and legal trends
- **AI Chat Interface** - Interactive chat assistant for legal research (currently using mock responses)
- **Data Visualization** - Charts and graphs for market analysis and case statistics
- **Email Outreach** - Track and manage outreach to legal contacts
- **Modern UI** - Clean, responsive design with Tailwind CSS and Material-UI components

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Material-UI** for data grids and components
- **Recharts** for data visualization
- **React Router** for navigation
- **React Query** for data fetching and caching

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for easy deployment to Vercel. The `vercel.json` file handles client-side routing for the SPA.

## Mock Data

For frontend-only deployment, the AI chat uses mock responses. The external API endpoints from `react-admin-ui-v1-api.vercel.app` remain functional for dashboard data.
