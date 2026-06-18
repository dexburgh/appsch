# Overview

Anaesthetic Ease is a comprehensive clinical documentation application designed for anesthesiologists to streamline procedure documentation and billing workflows. The application follows the "Quote to Cash - Without the Crash" philosophy, providing a seamless workflow for capturing patient information, procedure images, medical codes, time tracking, clinical notes, and automated billing submission to PMA systems. It features offline capabilities, real-time data synchronization, and premium Nexpath branding with the tagline "PRECISION. COMPLIANCE. CLARITY." The application now integrates professional medical branding assets and maintains a sophisticated metallic gold and dark slate color scheme reflecting the premium positioning.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

**August 18, 2025**: Project handover document completed - all features implemented and production ready.
- Database integration with PostgreSQL fully operational
- PMB flagging system for ICD codes implemented with visual indicators  
- Procedure code search and selection functionality added
- Professional Nexpath branding integrated with purple-teal gradient logo
- Complete medical workflow from documentation to billing submission ready

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a component-based architecture with shadcn/ui for consistent medical-themed styling. The application uses Wouter for client-side routing and TanStack Query for state management and API communication. The UI follows a sophisticated Nexpath branding theme with metallic gold accents (#fbbf24) and dark slate backgrounds, featuring professional medical color schemes with predefined CSS variables for consistent theming across components. The branding includes premium visual elements, branded social media assets, and professional medical quote generation interfaces.

## Backend Architecture
The server is built on Express.js with TypeScript, providing a RESTful API architecture. The application uses a modular route system with centralized error handling and request logging middleware. The storage layer implements an interface-based design pattern allowing for different storage implementations, currently using in-memory storage but designed to easily switch to database persistence.

## Data Storage Solutions
The application uses Drizzle ORM configured for PostgreSQL with a comprehensive schema supporting procedures, images, medical codes, procedure times, and clinical notes. The database schema is designed with proper relationships and includes support for file uploads and metadata storage. Migration management is handled through Drizzle Kit.

## Real-time Features
The application includes offline capability detection with automatic data synchronization when connectivity is restored. It features real-time status indicators and optimistic updates for better user experience during network interruptions.

## File Upload System
Image capture functionality supports both camera access and file uploads with proper validation, size limits, and MIME type checking. Images are stored in a dedicated uploads directory with metadata tracking in the database.

## Component Architecture
The frontend follows a modular component structure with:
- Reusable UI components from shadcn/ui with Nexpath branding
- Feature-specific components for each major workflow
- Professional branding components (Header with Nexpath logo, Footer with branding, BrandingBanner)
- PMB (Private Medical Benefits) status indicators for ICD codes with visual green badges
- Enhanced medical codes interface supporting CPT, ICD-10, and Procedure codes
- Custom hooks for mobile detection and toast notifications
- Centralized query client configuration for API communication

## Build and Development Setup
The application uses Vite for development and building, with support for both development and production environments. The build process includes separate compilation for client and server code, with proper static asset handling and deployment configuration.

# External Dependencies

## Core Framework Dependencies
- **React & TypeScript**: Frontend framework with type safety
- **Express.js**: Backend web framework
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit
- **Drizzle Kit**: Database migration management
- **@neondatabase/serverless**: PostgreSQL database connection (serverless-compatible)

## UI and Styling
- **shadcn/ui components**: Comprehensive UI component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI primitives**: Accessible component primitives
- **Lucide React**: Icon library for consistent medical iconography

## File Handling
- **Multer**: Multipart file upload handling
- **File System APIs**: Browser camera access and file management

## Build Tools
- **Vite**: Build tool and development server
- **esbuild**: Fast JavaScript bundler for server compilation
- **tsx**: TypeScript execution for development

## Validation and Forms
- **Zod**: Schema validation library
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Form validation integration

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing