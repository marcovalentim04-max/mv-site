# MV Consultoria - Professional Consulting Services Website

A comprehensive business consulting platform that provides financial, accounting, and legal services for small to medium businesses with automated tools and expert support.

**Experience Qualities**: 
1. Professional - Clean, trustworthy interface that conveys expertise and reliability
2. Accessible - Simple navigation and clear information hierarchy for non-technical users  
3. Efficient - Streamlined processes that guide users quickly to services and solutions

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Multiple interconnected service modules, user accounts, document management, pricing calculators, and client portal functionality requiring sophisticated state management

## Essential Features

### Hero Section & Main Navigation
- **Functionality**: Primary landing area with service overview and main navigation
- **Purpose**: Immediately communicate value proposition and guide users to key services
- **Trigger**: Page load
- **Progression**: View hero message → Browse services → Navigate to specific modules
- **Success criteria**: Clear understanding of services offered, easy navigation to relevant sections

### Services Calculator Module
- **Functionality**: Interactive pricing calculator for different service packages
- **Purpose**: Provide transparent pricing and help users select appropriate service level
- **Trigger**: Click "Calcular Preços" or similar CTA
- **Progression**: Select business type → Choose services → View pricing → Contact for quote
- **Success criteria**: Users can estimate costs and understand service options

### Document Management System
- **Functionality**: Upload, organize and track business documents
- **Purpose**: Streamline document collection and organization for consulting services
- **Trigger**: Access from client portal or services section
- **Progression**: Login → Upload documents → Categorize → Track status → Receive updates
- **Success criteria**: Documents properly categorized and accessible to consultants

### Contact & Lead Generation
- **Functionality**: Multiple contact forms, consultation booking, and lead capture
- **Purpose**: Convert visitors into qualified leads and schedule consultations
- **Trigger**: Contact CTAs throughout site
- **Progression**: Fill contact form → Receive confirmation → Schedule consultation → Receive follow-up
- **Success criteria**: High-quality leads captured with complete information

### Service Information Pages
- **Functionality**: Detailed service descriptions, benefits, and process explanations
- **Purpose**: Educate potential clients about services and build trust
- **Trigger**: Navigation from main menu or service cards
- **Progression**: Browse services → Read details → View pricing → Contact for more info
- **Success criteria**: Users understand services and feel confident to engage

### Client Portal/Dashboard
- **Functionality**: Authenticated area for existing clients to manage their account
- **Purpose**: Provide ongoing value and self-service options for existing clients
- **Trigger**: Login from main navigation
- **Progression**: Login → View dashboard → Access documents → Check status → Download reports
- **Success criteria**: Clients can self-serve and track their projects

## Edge Case Handling
- **Form Validation Errors**: Clear inline validation with specific guidance for correction
- **Document Upload Failures**: Progress indicators and retry options with file size/type guidance
- **Payment Processing Issues**: Fallback contact options and clear error messaging
- **Mobile Navigation**: Collapsible menu with touch-friendly targets and logical flow
- **Slow Connections**: Progressive loading with skeleton states and essential content priority
- **Empty States**: Helpful guidance and next steps when no data is available

## Design Direction

The design should feel professional, trustworthy, and sophisticated while remaining approachable - similar to premium financial services with a modern, clean aesthetic that conveys expertise without intimidation.

## Color Selection

Complementary (opposite colors) - Using professional blues with warm accent colors to balance trust with approachability, creating visual interest while maintaining business credibility.

- **Primary Color**: Deep Professional Blue (oklch(0.25 0.15 240)) - Communicates trust, stability, and expertise
- **Secondary Colors**: Light Blue (oklch(0.95 0.02 240)) for backgrounds, Medium Blue (oklch(0.60 0.12 240)) for supporting elements
- **Accent Color**: Warm Orange (oklch(0.70 0.15 45)) - Attention-grabbing highlight for CTAs and important elements
- **Foreground/Background Pairings**: 
  - Background White (oklch(1 0 0)): Dark Blue text (oklch(0.25 0.15 240)) - Ratio 8.2:1 ✓
  - Primary Blue (oklch(0.25 0.15 240)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent Orange (oklch(0.70 0.15 45)): White text (oklch(1 0 0)) - Ratio 4.6:1 ✓
  - Secondary Light Blue (oklch(0.95 0.02 240)): Dark Blue text (oklch(0.25 0.15 240)) - Ratio 7.8:1 ✓

## Font Selection

Typography should convey professionalism and readability, using clean sans-serif fonts that work well for both headings and body text in business contexts.

- **Typographic Hierarchy**: 
  - H1 (Main Headlines): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing
  - H3 (Subsections): Inter Medium/20px/normal spacing
  - Body (Regular Text): Inter Regular/16px/relaxed line height
  - Small (Captions): Inter Regular/14px/normal spacing

## Animations

Subtle and professional animations that enhance usability without drawing attention to themselves, focusing on smooth transitions and micro-interactions that guide user attention effectively.

- **Purposeful Meaning**: Gentle fade-ins for content loading, smooth hover states for buttons, and subtle parallax for hero sections to create depth without distraction
- **Hierarchy of Movement**: Primary CTAs get hover animations, form elements show focus states, navigation transitions are smooth, loading states are informative

## Component Selection

- **Components**: Card components for services, Dialog for forms and detailed information, Tabs for organizing service information, Button variants for different action types, Input components with validation states, Table for pricing information
- **Customizations**: Custom hero sections with background patterns, specialized calculator components, document upload areas with drag-and-drop, professional testimonial cards
- **States**: Buttons show clear hover/active states with subtle shadows, form inputs highlight focus with border color changes, cards lift slightly on hover, navigation items show active states
- **Icon Selection**: Professional icons from Phosphor set - building icons for company services, document icons for paperwork, calculator for pricing, phone/email for contact
- **Spacing**: Consistent 4/8/16/24/32px spacing scale, generous padding on containers (p-8/p-12), proper gap spacing in grid layouts (gap-6/gap-8)
- **Mobile**: Mobile-first design with collapsible navigation, stacked card layouts, touch-friendly button sizes (min-h-12), responsive typography scaling, optimized form layouts for mobile input