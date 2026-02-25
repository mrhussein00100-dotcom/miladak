# Article Save Diagnostic Fix - Implementation Tasks

## Phase 0: Root Cause Fix (COMPLETED - January 2026)

### Task 0.1: Fix DOM-to-React State Synchronization ✅ COMPLETED

**Estimated Time**: 2 hours
**Status**: ✅ COMPLETED

**Problem**: Image replacements in the editor were not being persisted because the sync `useEffect` was overwriting DOM changes before they could be saved.

**Solution Implemented**:

1. Added `lastUpdateRef` to track recent updates and prevent sync from overwriting changes within 500ms
2. Modified `handleImageUpdate` to:
   - Update `lastUpdateRef.current` timestamp
   - Use `requestAnimationFrame` instead of `setTimeout` for better DOM sync
   - Force image src update if not found in DOM
   - Fallback to manual content replacement if image URL still missing

**Files Modified**:

- `components/admin/EnhancedRichTextEditor.tsx` - Modified sync useEffect and handleImageUpdate function

**Code Changes**:

```typescript
// Added ref to track recent updates
const lastUpdateRef = useRef<number>(0);

// Modified sync useEffect to skip recent updates
useEffect(() => {
  if (editorRef.current && editorRef.current.innerHTML !== value) {
    // Skip sync if recent update detected (within 500ms)
    const now = Date.now();
    if (now - lastUpdateRef.current < 500) {
      console.log('[Sync] Skipping sync - recent update detected');
      return;
    }
    // ... rest of sync logic
  }
}, [value]);

// Modified handleImageUpdate to properly sync DOM changes
const handleImageUpdate = useCallback(
  (newImageUrl?: string) => {
    if (editorRef.current) {
      // Update timestamp to prevent sync from overwriting
      lastUpdateRef.current = Date.now();

      // Force image src update if needed
      if (
        newImageUrl &&
        !currentDOMContent.includes(newImageUrl) &&
        selectedImageElement
      ) {
        selectedImageElement.src = newImageUrl;
      }

      // Use requestAnimationFrame for better DOM sync
      requestAnimationFrame(() => {
        // Read final content from DOM and update React state
        const finalContent = editorRef.current.innerHTML;
        onChange(finalContent);
      });
    }
  },
  [onChange, selectedImageElement]
);
```

**Acceptance Criteria**: ✅ All met

- [x] Image replacements are properly saved
- [x] DOM changes are synced to React state before save
- [x] No race conditions between DOM updates and sync useEffect
- [x] Console logging added for debugging

### Task 0.2: Verify ImageToolbar Integration ✅ COMPLETED

**Status**: ✅ COMPLETED

**Files Reviewed**:

- `components/admin/ImageToolbar.tsx` - Contains image replacement modal logic

**Verification**:

- ImageToolbar correctly calls `onUpdate(newUrl)` after replacing image
- Added delay (200ms) before calling onUpdate to ensure DOM is updated
- Added console logging for debugging

## Phase 1: Critical Infrastructure Fixes (Priority: URGENT)

### Task 1.1: Fix Diagnostic API CORS and Accessibility

**Estimated Time**: 2 hours
**Assignee**: Backend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Add proper CORS headers to `/api/admin/articles/test-save`
- [ ] Implement OPTIONS method for preflight requests
- [ ] Remove authentication requirement for diagnostic endpoints
- [ ] Add request timeout handling (30 seconds max)
- [ ] Implement proper error response format
- [ ] Add detailed logging for diagnostic requests

**Files to Modify**:

- `app/api/admin/articles/test-save/route.ts`
- `middleware.ts` (if CORS is handled there)

**Implementation Details**:

```typescript
// Add to route.ts
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Enhance POST method with CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

**Acceptance Criteria**:

- [ ] Diagnostic API responds to OPTIONS requests
- [ ] API accessible from browser without authentication
- [ ] Proper CORS headers in all responses
- [ ] Clear error messages in both Arabic and English
- [ ] Request timeout handling works correctly
- [ ] All responses include correlation IDs for tracking

### Task 1.2: Create Network Connectivity Test API

**Estimated Time**: 1 hour
**Assignee**: Backend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Create `/api/admin/connectivity-test` endpoint
- [ ] Implement simple ping-like functionality
- [ ] Add response time measurement
- [ ] Include server timestamp in response
- [ ] Add CORS headers
- [ ] Add health check information

**Files to Create**:

- `app/api/admin/connectivity-test/route.ts`

**Implementation Details**:

```typescript
export async function GET() {
  const startTime = Date.now();

  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      server: 'miladak-v2',
      responseTime: Date.now() - startTime,
      version: '1.0.0',
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    }
  );
}
```

**Acceptance Criteria**:

- [ ] Endpoint responds within 1 second
- [ ] Returns server status and timestamp
- [ ] Accessible without authentication
- [ ] Proper CORS configuration
- [ ] Includes performance metrics

### Task 1.3: Enhanced Error Handling in Main Save API

**Estimated Time**: 3 hours
**Assignee**: Backend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Review current error handling in `/api/admin/articles/[id]/route.ts`
- [ ] Implement structured error responses
- [ ] Add error categorization (network, validation, server, etc.)
- [ ] Implement request logging with correlation IDs
- [ ] Add performance monitoring
- [ ] Create error recovery suggestions

**Files to Modify**:

- `app/api/admin/articles/[id]/route.ts`
- `lib/utils/errorHandler.ts` (create if doesn't exist)

**Implementation Details**:

```typescript
interface ApiError {
  type: 'network' | 'validation' | 'server' | 'timeout' | 'auth';
  message: string;
  details?: string;
  suggestions: string[];
  correlationId: string;
  timestamp: string;
}
```

**Acceptance Criteria**:

- [ ] All errors return structured JSON responses
- [ ] Error messages are user-friendly and actionable
- [ ] Correlation IDs for tracking issues
- [ ] Performance metrics logged
- [ ] Recovery suggestions provided
- [ ] Error categorization is accurate

## Phase 2: Client-Side Resilience (Priority: HIGH)

### Task 2.1: Implement Auto-Backup System

**Estimated Time**: 4 hours
**Assignee**: Frontend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Create AutoBackup component
- [ ] Implement localStorage backup every 30 seconds
- [ ] Add content recovery on page load
- [ ] Create backup management UI
- [ ] Implement export/import functionality
- [ ] Add conflict resolution for recovered content

**Files to Create**:

- `components/admin/AutoBackup.tsx`
- `lib/services/BackupManager.ts`
- `hooks/useAutoBackup.ts`

**Files to Modify**:

- `app/admin/articles/[id]/page.tsx`

**Implementation Details**:

```typescript
interface BackupData {
  content: string;
  timestamp: number;
  articleId?: string;
  version: number;
  metadata: {
    title?: string;
    lastModified: number;
    wordCount: number;
  };
}

const useAutoBackup = (content: string, articleId?: string) => {
  // Auto-backup logic with debouncing
  // Recovery detection on mount
  // Conflict resolution
};
```

**Acceptance Criteria**:

- [ ] Content automatically backed up every 30 seconds
- [ ] Recovery prompt shown on page reload if backup exists
- [ ] Export functionality works for all content formats
- [ ] Import handles various content formats
- [ ] Conflict resolution UI is intuitive
- [ ] Backup cleanup prevents storage bloat

### Task 2.2: Enhanced Diagnostic Tool

**Estimated Time**: 3 hours
**Assignee**: Frontend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Fix network connectivity issues in diagnostic tool
- [ ] Add retry mechanism with exponential backoff
- [ ] Implement browser capability detection
- [ ] Add network quality testing
- [ ] Enhance error reporting with actionable suggestions
- [ ] Add progress indicators for long-running tests

**Files to Modify**:

- `components/admin/ArticleSaveDiagnostic.tsx`

**Implementation Details**:

```typescript
const diagnosticTests = [
  { name: 'Network Connectivity', test: testConnectivity },
  { name: 'Server Response', test: testServerResponse },
  { name: 'CORS Configuration', test: testCORS },
  { name: 'Content Validation', test: testValidation },
  { name: 'Save Simulation', test: testSave },
];

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  // Exponential backoff implementation
}
```

**Acceptance Criteria**:

- [ ] Diagnostic tool works reliably across browsers
- [ ] Retry mechanism handles temporary network issues
- [ ] Browser capabilities are properly detected
- [ ] Network quality assessment is accurate
- [ ] Error messages provide clear next steps
- [ ] Progress indicators show test status

### Task 2.3: Real-time Content Validation

**Estimated Time**: 5 hours
**Assignee**: Frontend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Create RealTimeValidator component
- [ ] Implement live image URL validation
- [ ] Add duplicate image detection
- [ ] Create content size monitoring
- [ ] Implement character encoding validation
- [ ] Add visual indicators for validation status
- [ ] Create auto-fix suggestions

**Files to Create**:

- `components/admin/RealTimeValidator.tsx`
- `lib/services/ValidationEngine.ts`
- `hooks/useRealTimeValidation.ts`

**Files to Modify**:

- `app/admin/articles/[id]/page.tsx`
- `components/admin/RichTextEditor.tsx`

**Implementation Details**:

```typescript
interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  stats: ContentStats;
  suggestions: AutoFixSuggestion[];
}

const useRealTimeValidation = (content: string) => {
  // Debounced validation (1 second)
  // Image URL checking
  // Duplicate detection
  // Character validation
};
```

**Acceptance Criteria**:

- [ ] Validation runs in real-time without performance impact
- [ ] Image URLs are validated within 2 seconds
- [ ] Duplicate images are highlighted immediately
- [ ] Content size warnings appear before limits
- [ ] Auto-fix suggestions are contextually relevant
- [ ] Visual feedback is clear and non-intrusive

## Phase 3: Advanced Features (Priority: MEDIUM)

### Task 3.1: Implement Save Manager Service

**Estimated Time**: 4 hours
**Assignee**: Frontend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Create SaveManager service class
- [ ] Implement retry logic with exponential backoff
- [ ] Add queue management for failed saves
- [ ] Implement offline detection and handling
- [ ] Create save progress tracking
- [ ] Add save conflict resolution

**Files to Create**:

- `lib/services/SaveManager.ts`
- `lib/services/NetworkMonitor.ts`
- `hooks/useSaveManager.ts`

**Implementation Details**:

```typescript
class SaveManager {
  private retryQueue: SaveOperation[] = [];
  private isOnline: boolean = true;

  async save(content: string, options: SaveOptions): Promise<SaveResult> {
    // Retry logic with exponential backoff
    // Queue management for offline scenarios
    // Progress tracking
  }

  private async retryFailedSaves(): Promise<void> {
    // Process retry queue when back online
  }
}
```

**Acceptance Criteria**:

- [ ] Failed saves are automatically retried
- [ ] Offline saves are queued and processed when online
- [ ] Save progress is visible to users
- [ ] Conflicts are resolved gracefully
- [ ] Performance impact is minimal
- [ ] Queue persistence across page reloads

### Task 3.2: Database Schema for Logging and Backups

**Estimated Time**: 2 hours
**Assignee**: Backend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Create content_backups table migration
- [ ] Create save_attempt_logs table migration
- [ ] Implement backup cleanup job
- [ ] Add indexes for performance
- [ ] Create backup retention policy

**Files to Create**:

- `lib/db/migrations/add_content_backups.sql`
- `lib/db/migrations/add_save_logs.sql`
- `scripts/cleanup-old-backups.js`

**SQL Schema**:

```sql
CREATE TABLE content_backups (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id),
  content TEXT NOT NULL,
  backup_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  session_id VARCHAR(255),
  metadata JSONB
);

CREATE TABLE save_attempt_logs (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id),
  attempt_type VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  error_details JSONB,
  response_time_ms INTEGER,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Acceptance Criteria**:

- [ ] Tables created successfully in all environments
- [ ] Backup cleanup runs automatically daily
- [ ] Query performance is acceptable (<100ms)
- [ ] Retention policy prevents storage bloat
- [ ] Indexes optimize common queries

### Task 3.3: Monitoring and Analytics Dashboard

**Estimated Time**: 6 hours
**Assignee**: Full-stack Developer
**Status**: Not Started

**Subtasks**:

- [ ] Create admin dashboard for save statistics
- [ ] Implement error rate monitoring
- [ ] Add performance metrics visualization
- [ ] Create browser compatibility reports
- [ ] Implement alerting for high error rates
- [ ] Add user experience metrics

**Files to Create**:

- `app/admin/diagnostics/page.tsx`
- `components/admin/DiagnosticsDashboard.tsx`
- `app/api/admin/diagnostics/stats/route.ts`
- `lib/services/MonitoringService.ts`

**Implementation Details**:

```typescript
interface DiagnosticStats {
  totalTests: number;
  successRate: number;
  averageResponseTime: number;
  errorsByType: Record<string, number>;
  browserStats: Record<string, number>;
  timeSeriesData: TimeSeriesPoint[];
}
```

**Acceptance Criteria**:

- [ ] Dashboard shows real-time save statistics
- [ ] Error trends are clearly visualized
- [ ] Performance metrics are actionable
- [ ] Browser issues are identified quickly
- [ ] Alerts are sent for critical issues
- [ ] Data is updated in real-time

## Phase 4: Testing and Optimization (Priority: MEDIUM)

### Task 4.1: Comprehensive Testing Suite

**Estimated Time**: 8 hours
**Assignee**: QA Engineer + Developers
**Status**: Not Started

**Subtasks**:

- [ ] Create unit tests for all new components
- [ ] Implement integration tests for API endpoints
- [ ] Add end-to-end tests for save workflows
- [ ] Create browser compatibility test suite
- [ ] Implement network condition simulation tests
- [ ] Add performance regression tests

**Files to Create**:

- `__tests__/components/AutoBackup.test.tsx`
- `__tests__/components/RealTimeValidator.test.tsx`
- `__tests__/api/test-save.test.ts`
- `__tests__/services/SaveManager.test.ts`
- `__tests__/e2e/article-save.spec.ts`

**Test Categories**:

```typescript
describe('Article Save Diagnostic Fix', () => {
  describe('CORS Configuration', () => {
    // Test OPTIONS requests
    // Test cross-origin requests
    // Test header validation
  });

  describe('Auto-backup System', () => {
    // Test backup creation
    // Test recovery scenarios
    // Test conflict resolution
  });

  describe('Real-time Validation', () => {
    // Test validation accuracy
    // Test performance impact
    // Test error handling
  });
});
```

**Acceptance Criteria**:

- [ ] 90%+ code coverage for new components
- [ ] All API endpoints have integration tests
- [ ] E2E tests cover happy path and error scenarios
- [ ] Browser compatibility verified automatically
- [ ] Performance benchmarks established
- [ ] Tests run in CI/CD pipeline

### Task 4.2: Performance Optimization

**Estimated Time**: 4 hours
**Assignee**: Frontend Developer
**Status**: Not Started

**Subtasks**:

- [ ] Implement content chunking for large articles
- [ ] Add debouncing for auto-save operations
- [ ] Optimize validation algorithms
- [ ] Implement caching for validation results
- [ ] Add lazy loading for diagnostic components
- [ ] Optimize bundle size

**Files to Modify**:

- `components/admin/RealTimeValidator.tsx`
- `lib/services/ValidationEngine.ts`
- `hooks/useAutoBackup.ts`

**Performance Targets**:

- Large articles (>1MB) save within 10 seconds
- Real-time validation latency <100ms
- Auto-save doesn't impact typing performance
- Bundle size increase <50KB
- Memory usage optimized

**Acceptance Criteria**:

- [ ] Performance targets are met
- [ ] No regression in existing functionality
- [ ] Memory leaks are prevented
- [ ] Bundle analysis shows optimization
- [ ] User experience is smooth

## Phase 5: Documentation and Training (Priority: LOW)

### Task 5.1: User Documentation

**Estimated Time**: 3 hours
**Assignee**: Technical Writer
**Status**: Not Started

**Subtasks**:

- [ ] Update troubleshooting guide
- [ ] Create user manual for new features
- [ ] Document error messages and solutions
- [ ] Create video tutorials
- [ ] Update FAQ section

**Files to Create/Modify**:

- `ARTICLE_SAVE_TROUBLESHOOTING_GUIDE.md`
- `docs/user-manual/article-editing.md`
- `docs/error-reference.md`

**Documentation Sections**:

1. Quick Start Guide
2. Troubleshooting Common Issues
3. Error Message Reference
4. Advanced Features Guide
5. FAQ and Tips

**Acceptance Criteria**:

- [ ] All new features are documented
- [ ] Error messages have corresponding help articles
- [ ] Video tutorials are clear and concise
- [ ] FAQ covers common issues
- [ ] Documentation is available in Arabic and English

### Task 5.2: Developer Documentation

**Estimated Time**: 2 hours
**Assignee**: Lead Developer
**Status**: Not Started

**Subtasks**:

- [ ] Document new API endpoints
- [ ] Create architecture diagrams
- [ ] Document deployment procedures
- [ ] Create troubleshooting guide for developers
- [ ] Document monitoring and alerting setup

**Files to Create/Modify**:

- `docs/api/diagnostic-endpoints.md`
- `docs/architecture/save-system.md`
- `docs/deployment/diagnostic-features.md`

**Technical Documentation**:

1. API Reference
2. Architecture Overview
3. Database Schema
4. Deployment Guide
5. Monitoring Setup

**Acceptance Criteria**:

- [ ] API documentation is complete and accurate
- [ ] Architecture is clearly explained
- [ ] Deployment steps are reproducible
- [ ] Troubleshooting guide covers common issues
- [ ] Code examples are working and tested

## Dependencies and Blockers

### Critical Dependencies

1. **CORS Configuration**: Must be fixed before any client-side improvements
2. **Database Access**: Required for logging and backup features
3. **Authentication System**: May need modifications for diagnostic endpoints
4. **Server Configuration**: May require infrastructure changes

### Potential Blockers

1. **Server Configuration**: May need infrastructure team involvement
2. **Browser Limitations**: Some features may not work in older browsers
3. **Performance Impact**: New features must not degrade existing performance
4. **Database Migration**: May require downtime for schema changes

## Risk Mitigation

### High-Risk Items

1. **CORS Changes**: Test thoroughly to avoid breaking existing functionality
2. **Database Migrations**: Ensure rollback procedures are tested
3. **Performance Impact**: Monitor closely during rollout
4. **Authentication Changes**: May affect other parts of the system

### Mitigation Strategies

1. **Feature Flags**: Use for gradual rollout of new features
2. **A/B Testing**: Test with subset of users first
3. **Monitoring**: Implement comprehensive monitoring before deployment
4. **Rollback Plan**: Ensure quick rollback capability for all changes
5. **Staging Environment**: Test all changes in production-like environment

## Success Metrics

### Technical Metrics

- [ ] Diagnostic API availability: >99%
- [ ] Save success rate: >98%
- [ ] Average save time: <5 seconds
- [ ] Error recovery rate: >90%
- [ ] API response time: <2 seconds

### User Experience Metrics

- [ ] User satisfaction score: >4.5/5
- [ ] Support ticket reduction: >50%
- [ ] Feature adoption rate: >80%
- [ ] Time to resolution for issues: <2 minutes
- [ ] User retention after issues: >95%

## Timeline

### Week 1: Critical Infrastructure Fixes

- **Days 1-2**: Task 1.1 - Fix CORS and API accessibility
- **Day 3**: Task 1.2 - Create connectivity test API
- **Days 4-5**: Task 1.3 - Enhanced error handling
- **Testing and deployment of Phase 1**

### Week 2: Client-Side Enhancements

- **Days 1-2**: Task 2.1 - Auto-backup system
- **Day 3**: Task 2.2 - Enhanced diagnostic tool
- **Days 4-5**: Task 2.3 - Real-time validation
- **User testing and feedback collection**

### Week 3: Advanced Features

- **Days 1-2**: Task 3.1 - Save manager service
- **Day 3**: Task 3.2 - Database schema changes
- **Days 4-5**: Task 3.3 - Monitoring dashboard
- **Performance optimization and testing**

### Week 4: Testing and Documentation

- **Days 1-3**: Task 4.1 - Comprehensive testing
- **Day 4**: Task 4.2 - Performance optimization
- **Day 5**: Tasks 5.1 & 5.2 - Documentation
- **Final testing and deployment preparation**

## Post-Implementation

### Monitoring Plan

- **Daily**: Error rates and performance metrics
- **Weekly**: User feedback and support tickets
- **Monthly**: Usage patterns and optimization opportunities
- **Quarterly**: Feature effectiveness and user satisfaction

### Maintenance Plan

- **Daily**: Automated backup cleanup
- **Weekly**: Performance monitoring review
- **Monthly**: Security audit of diagnostic endpoints
- **Quarterly**: Browser compatibility testing
- **Annually**: Full system security audit

### Future Enhancements

1. **Real-time Collaborative Editing**: WebSocket-based collaboration
2. **Advanced Content Versioning**: Git-like version control
3. **AI-powered Content Validation**: Machine learning for content quality
4. **Mobile App Support**: Native mobile editing capabilities
5. **Advanced Analytics**: Predictive analytics for content performance

## Rollback Procedures

### Database Rollback

1. **Backup Current State**: Before any schema changes
2. **Migration Scripts**: Tested rollback migrations
3. **Data Verification**: Ensure data integrity after rollback
4. **Performance Testing**: Verify performance after rollback

### Code Rollback

1. **Feature Flags**: Disable new features instantly
2. **Previous Versions**: Keep previous API versions available
3. **Gradual Rollout**: Roll back in stages if needed
4. **Monitoring**: Watch metrics during rollback

### Communication Plan

1. **Internal Team**: Immediate notification of issues
2. **Users**: Transparent communication about any disruptions
3. **Stakeholders**: Regular updates on progress and issues
4. **Documentation**: Update all relevant documentation
