export const serverlessCatalog = [
  {
    name: 'Hello heartbeat',
    endpoint: '/api/hello',
    methods: ['GET'],
    description:
      'Returns a MediBurgh greeting and timestamp to confirm the environment is running and responding to JSON requests.',
  },
  {
    name: 'Edge status',
    endpoint: '/api/edge-status',
    methods: ['GET'],
    description:
      'Edge runtime check that reports the executing region and disables caching so observability dashboards capture real-time responses.',
  },
  {
    name: 'Header validation',
    endpoint: '/api/headers',
    methods: ['GET'],
    description:
      'Validates required custom headers, returning actionable 400/431 responses when contract limits are breached.',
  },
  {
    name: 'Method matrix',
    endpoint: '/api/methods',
    methods: ['GET', 'POST'],
    description:
      'Demonstrates verb handling by echoing JSON on POST and advertising the supported methods for unsupported verbs.',
  },
  {
    name: 'Range streaming demo',
    endpoint: '/api/range',
    methods: ['GET'],
    description:
      'Responds with 200 or 206 status codes based on Range headers to illustrate resumable downloads and partial payload delivery.',
  },
  {
    name: 'Slow upstream guard',
    endpoint: '/api/slow',
    methods: ['GET'],
    description:
      'Simulates a delayed dependency with abort handling to surface graceful 504 timeouts versus unexpected upstream failures.',
  },
  {
    name: 'External fetch proxy',
    endpoint: '/api/external',
    methods: ['GET'],
    description:
      'Fetches vetted third-party URLs with protocol and host safelists plus a five-second timeout to prevent SSRF issues.',
  },
  {
    name: 'Upload guardrail',
    endpoint: '/api/upload',
    methods: ['POST'],
    description:
      'Accepts binary payloads up to 1 MiB and rejects larger bodies early to avoid FUNCTION_PAYLOAD_TOO_LARGE responses.',
  },
  {
    name: 'Personality insights',
    endpoint: '/api/personality',
    methods: ['GET'],
    description:
      'Returns compatibility matrices for Enneagram, attachment, and MBTI frameworks. Supports project targeting via the ?project query (for example, project=manix) so you can send codes to the Manix repo when needed.',
  },
];
