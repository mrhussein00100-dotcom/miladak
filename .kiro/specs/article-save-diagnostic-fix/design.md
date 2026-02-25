# Article Save Diagnostic Fix - Technical Design

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Browser       │    │   Next.js API   │    │   Database      │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Editor UI   │◄┼────┼►│ Save API     │◄┼────┼►│ Articles    │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │                 │
│ │ Diagnostic  │◄┼────┼►│ Test API     │ │    │                 │
│ │ Tool        │ │    │ └──────────────┘ │    │                 │
│ └─────────────┘ │    │                  │    │                 │
│                 │    │ ┌──────────────┐ │    │                 │
│ ┌─────────────┐ │    │ │ Debug API    │ │    │                 │
│ │ Auto-backup │ │    │ └──────────────┘ │    │                 │
│ └─────────────┘ │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Component Design

### 1. Enhanced Diagnostic API

**File**: `app/api/admin/articles/test-save/route.ts`

**Current Issues**:

- Missing CORS headers for browser requests
- No OPTIONS method for preflight requests
- Potential authentication blocking
- Limited error handling
- No timeout protection

**Enhanced Implementation**:

```typescript
// Add CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// OPTIONS handler for preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Enhanced POST handler
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );

    const processPromise = processRequest(request);

    const result = await Promise.race([processPromise, timeoutPromise]);

    return NextResponse.json(result, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Diagnostic test failed',
        details: error.message,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
```

### 2. Network Connectivity Test API

**New File**: `app/api/admin/connectivity-test/route.ts`

**Purpose**: Simple endpoint to test network connectivity and server responsiveness

```typescript
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      server: 'miladak-v2',
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

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
```

### 3. Enhanced Client-Side Diagnostic Tool

**File**: `components/admin/ArticleSaveDiagnostic.tsx`

**Enhancements**:

- Network connectivity testing before diagnostic
- Retry mechanism with exponential backoff
- Better error categorization and reporting
- Browser capability detection
- Performance monitoring

```typescript
interface DiagnosticTest {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
  duration?: number;
}

const diagnosticTests: DiagnosticTest[] = [
  { name: 'Network Connectivity', status: 'pending' },
  { name: 'Server Response', status: 'pending' },
  { name: 'Content Validation', status: 'pending' },
  { name: 'Save Simulation', status: 'pending' },
];

// Retry mechanism with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 4. Auto-Backup System

**New Component**: `components/admin/AutoBackup.tsx`

**Features**:

- Automatic localStorage backup every 30 seconds
- Content recovery on page reload
- Export/import functionality
- Conflict resolution UI

```typescript
interface BackupData {
  content: string;
  timestamp: number;
  articleId?: string;
  version: number;
}

const useAutoBackup = (content: string, articleId?: string) => {
  const [hasBackup, setHasBackup] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  // Auto-backup every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (content && content.length > 100) {
        const backup: BackupData = {
          content,
          timestamp: Date.now(),
          articleId,
          version: 1,
        };

        localStorage.setItem(
          `article-backup-${articleId || 'new'}`,
          JSON.stringify(backup)
        );

        setLastBackup(new Date());
        setHasBackup(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [content, articleId]);

  return { hasBackup, lastBackup };
};
```

### 5. Real-time Content Validator

**New Component**: `components/admin/RealTimeValidator.tsx`

**Features**:

- Live image URL validation
- Duplicate image detection
- Content size monitoring
- Character encoding validation

```typescript
interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  stats: {
    contentLength: number;
    imageCount: number;
    duplicateImages: number;
    invalidChars: number;
  };
}

const useRealTimeValidation = (content: string) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (content) {
        setIsValidating(true);
        try {
          const result = await validateContent(content);
          setValidation(result);
        } catch (error) {
          console.error('Validation error:', error);
        } finally {
          setIsValidating(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  return { validation, isValidating };
};
```

## API Endpoints

### 1. Enhanced Test Save API

**Endpoint**: `POST /api/admin/articles/test-save`

**Changes**:

- Add CORS headers to all responses
- Implement OPTIONS method for preflight requests
- Remove authentication requirement for diagnostic mode
- Add timeout protection (30 seconds)
- Enhanced error categorization
- Detailed performance logging

### 2. Network Connectivity Test

**Endpoint**: `GET /api/admin/connectivity-test`

**Purpose**:

- Test basic network connectivity
- Verify server responsiveness
- Check CORS configuration
- Monitor server health

### 3. Browser Capability Test

**Endpoint**: `POST /api/admin/browser-test`

**Purpose**:

- Test browser-specific features
- Validate JavaScript capabilities
- Check localStorage availability
- Test network request capabilities

## Error Handling Strategy

### 1. Error Categories

```typescript
enum DiagnosticErrorType {
  NETWORK_ERROR = 'network_error',
  CORS_ERROR = 'cors_error',
  TIMEOUT_ERROR = 'timeout_error',
  SERVER_ERROR = 'server_error',
  VALIDATION_ERROR = 'validation_error',
  BROWSER_ERROR = 'browser_error',
}

interface DiagnosticError {
  type: DiagnosticErrorType;
  message: string;
  details?: string;
  suggestions: string[];
  recoverable: boolean;
}
```

### 2. Error Recovery Actions

```typescript
const errorRecoveryMap: Record<DiagnosticErrorType, string[]> = {
  [DiagnosticErrorType.NETWORK_ERROR]: [
    'Check internet connection',
    'Try again in a few moments',
    'Use a different network if available',
  ],
  [DiagnosticErrorType.CORS_ERROR]: [
    'This is a server configuration issue',
    'Contact system administrator',
    'Try using a different browser',
  ],
  [DiagnosticErrorType.TIMEOUT_ERROR]: [
    'Server is responding slowly',
    'Try with smaller content',
    'Check network speed',
  ],
  // ... more error types
};
```

## Performance Optimizations

### 1. Content Chunking

- Split large content into smaller chunks for processing
- Parallel validation of different content sections
- Progressive saving for large articles

### 2. Caching Strategy

- Cache validation results for unchanged content
- Cache image URL validation results
- Use service worker for offline functionality

### 3. Debouncing and Throttling

- Debounce auto-save operations (30 seconds)
- Debounce real-time validation (1 second)
- Throttle network connectivity checks (5 seconds)

## Security Considerations

### 1. CORS Configuration

```typescript
// Secure CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'production' ? 'https://miladak.com' : '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};
```

### 2. Rate Limiting

- Limit diagnostic API calls per IP (10 per minute)
- Prevent abuse of test endpoints
- Implement progressive delays for repeated failures

### 3. Content Sanitization

- Enhanced XSS protection for diagnostic content
- SQL injection prevention
- File upload security for backup/restore

## Monitoring and Logging

### 1. Diagnostic Metrics

```typescript
interface DiagnosticMetrics {
  timestamp: string;
  userAgent: string;
  testType: string;
  success: boolean;
  responseTime: number;
  errorType?: string;
  contentLength: number;
  imageCount: number;
}
```

### 2. Performance Monitoring

- Track API response times
- Monitor error rates by type
- Log browser compatibility issues
- Track user experience metrics

### 3. Alerting System

- High error rate alerts (>10% in 5 minutes)
- Performance degradation alerts (>5s response time)
- Service availability alerts
- User experience impact alerts

## Testing Strategy

### 1. Unit Tests

- Validation logic testing
- Error handling testing
- Retry mechanism testing
- Backup/recovery testing

### 2. Integration Tests

- API endpoint testing with CORS
- Database operation testing
- Cross-browser compatibility testing
- Network condition simulation

### 3. End-to-End Tests

- Complete diagnostic workflow testing
- Error scenario testing
- Recovery mechanism testing
- Performance benchmarking

## Deployment Considerations

### 1. Rollout Strategy

- Deploy CORS fixes first
- Gradual rollout of client enhancements
- Feature flags for new functionality
- A/B testing for user experience improvements

### 2. Rollback Plan

- Keep previous API versions available
- Implement feature toggles
- Database migration rollback scripts
- Content backup verification

### 3. Monitoring During Deployment

- Real-time error rate monitoring
- Performance impact assessment
- User feedback collection
- Immediate rollback triggers

## Future Enhancements

### 1. Advanced Features

- WebSocket for real-time collaboration
- AI-powered content validation
- Advanced image optimization
- Mobile app support

### 2. Analytics and Insights

- User behavior analytics
- Content quality metrics
- Performance optimization suggestions
- Predictive error prevention

### 3. Integration Possibilities

- Third-party image services
- Content delivery networks
- Advanced backup solutions
- Collaborative editing features
