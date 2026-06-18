import { z } from 'zod';
import { insertBillingEntrySchema, billingEntries, insertUserSchema, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    }
  },
  billingEntries: {
    list: {
      method: 'GET' as const,
      path: '/api/billing-entries',
      responses: {
        200: z.array(z.custom<typeof billingEntries.$inferSelect & { photos: any[], anaesthetist: any }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/billing-entries/:id',
      responses: {
        200: z.custom<typeof billingEntries.$inferSelect & { photos: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/billing-entries',
      input: insertBillingEntrySchema.extend({
        photoUrls: z.array(z.string()).optional(),
      }),
      responses: {
        201: z.custom<typeof billingEntries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    process: {
      method: 'PATCH' as const,
      path: '/api/billing-entries/:id/process',
      input: z.object({
        status: z.enum(["deferred", "done"]),
        officeNotes: z.string().optional(),
        accountNumber: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof billingEntries.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  uploads: {
    create: {
      method: 'POST' as const,
      path: '/api/upload',
      // input is FormData
      responses: {
        200: z.object({ url: z.string() }),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
