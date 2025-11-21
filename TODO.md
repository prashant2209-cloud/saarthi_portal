# Multi-lingual Website Implementation Plan

## Overview
Transform the SAARTHI civic engagement platform into a multi-lingual website supporting multiple languages to make it accessible to users from diverse linguistic backgrounds.

## Current State Analysis
- All text is hardcoded in English across all React components
- No internationalization framework in place
- Components include: Index, Auth, Dashboard, ReportIssue, Feed, Chatbot, Profile, IssueDetails, NotFound

## Implementation Plan

### Phase 1: Setup Internationalization Framework
- [ ] Install react-i18next and i18next dependencies
- [ ] Configure i18n setup in the application
- [ ] Create language detection and switching mechanism
- [ ] Set up translation file structure

### Phase 2: Extract and Organize Translations
- [ ] Create translation JSON files for supported languages (English, Hindi, etc.)
- [ ] Extract all hardcoded strings from components
- [ ] Categorize translations (UI elements, messages, categories, etc.)
- [ ] Create translation keys following consistent naming convention

### Phase 3: Implement Language Switcher
- [ ] Add language selector component to navigation
- [ ] Implement language persistence (localStorage)
- [ ] Add language options (English, Hindi, potentially more)

### Phase 4: Update Components with Translation Keys
- [x] Update App.tsx and routing components
- [x] Update Index.tsx (hero section, features, stats, footer)
- [x] Update Auth.tsx (login/signup forms, labels, messages)
- [x] Update Dashboard.tsx (KPIs, charts, activity feeds)
- [x] Update ReportIssue.tsx (form fields, categories, help text)
- [x] Update Feed.tsx (filters, issue cards, status badges)
- [x] Update Chatbot.tsx (messages, suggestions, quick actions)
- [x] Update Profile.tsx (user info, stats, badges, activity)
- [x] Update IssueDetails.tsx (issue info, comments, timeline)
- [x] Update NotFound.tsx (error messages)

### Phase 5: Backend Integration (Future)
- [ ] Update backend to support multi-lingual content
- [ ] Add language preference to user profiles
- [ ] Implement server-side language detection

### Phase 6: Testing and Polish
- [ ] Test language switching functionality
- [ ] Verify all text is properly translated
- [ ] Check RTL language support if needed
- [ ] Performance optimization for translation loading
- [ ] Accessibility considerations for screen readers
- [x] Implementation completed - all components updated with translation keys
- [ ] Manual testing required due to browser tool limitations

### Phase 7: Homepage Enhancements
- [x] Add testimonials section to Index.tsx between Features and CTA
- [x] Add testimonials translations to en/pages.json and hi/pages.json
- [x] Implement grid layout for 3-4 user testimonials

## Code Quality Fixes

### Backend Lint Issues
- [ ] Fix `any` types in controllers (authController.ts, issueController.ts, commentController.ts)
  - [ ] Update authController.ts: Remove `(user._id as any)`, ensure IUser typing
  - [ ] Update issueController.ts: Replace `query: any` with `Partial<IssueQuery>`, `sortOptions` with `SortOptions`
  - [ ] Update commentController.ts: Change `user?: any` to `user?: IUser`
- [ ] Fix `any` types in middleware (auth.ts, errorHandler.ts)
  - [ ] Update auth.ts: Type `decoded` as `JWTPayload`
  - [ ] Update errorHandler.ts: Type errors properly, use `unknown` for values
- [ ] Fix `any` types in models (User.ts) - No changes needed
- [ ] Fix `any` types in utils (jwt.ts)
  - [ ] Remove `(jwt.sign as any)`
- [ ] Define proper interfaces for JWT payload and user objects - Create backend/src/types/index.ts
- [ ] Replace empty object types `{}` with `object` or specific types in models - No changes needed
- [ ] Run ESLint verification: cd backend && npx eslint src/**/*.ts
- [ ] Test backend functionality

### Frontend Lint Issues
- [ ] Remove empty interfaces in UI components (command.tsx, textarea.tsx)
- [ ] Fix `any` types in pdfGenerator.ts and Index.tsx
- [ ] Replace `require()` with ES6 import in tailwind.config.ts
- [ ] Address fast refresh warnings by separating exports

### Runtime Fixes
- [ ] Ensure MongoDB connection and proper .env configuration
- [ ] Fix health endpoint 403 issue (check CORS or middleware)
- [ ] Test full application with backend and frontend running

## Supported Languages (Initial)
- English (en) - Default
- Hindi (hi) - Primary Indian language
- Potentially add: Tamil, Telugu, Bengali, Marathi, Gujarati

## Technical Considerations
- Use react-i18next for React integration
- JSON files for translations
- Lazy loading of translation files
- Fallback to English for missing translations
- Date/number formatting based on locale

## Dependencies to Add
- react-i18next
- i18next
- i18next-browser-languagedetector (optional)

## File Structure
```
src/
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── pages.json
│       │   └── components.json
│       └── hi/
│           ├── common.json
│           ├── pages.json
│           └── components.json
├── components/
│   └── LanguageSwitcher.tsx
└── ...
