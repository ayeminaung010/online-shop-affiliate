/**
 * Zod validation schemas for API routes
 */

import { z } from 'zod';

// Product status enum
export const ProductStatusSchema = z.enum(['active', 'need_recheck', 'inactive', 'low_confidence']);

// Allowed affiliate domains (prevent open redirect)
export const ALLOWED_AFFILIATE_DOMAINS = [
  'shopee.co.th',
  'shopee.sg',
  'lazada.co.th',
  'lazada.sg',
  'shopee.com',
  'lazada.com',
];

// Create product schema
export const CreateProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
  platform: z.enum(['Shopee', 'Lazada'], 'Invalid platform'),
  category: z.string().min(1, 'Category is required').max(100),
  price: z.number().positive('Price must be positive').finite(),
  oldPrice: z.number().nonnegative('Old price must be non-negative').optional().default(0),
  imageUrl: z.string().url('Invalid image URL'),
  affiliateUrl: z.string().url('Invalid affiliate URL'),
  description: z.string().max(2000, 'Description too long').optional().default(''),
  priority: z.number().int().min(0).max(1000).optional().default(0),
  status: ProductStatusSchema.optional().default('active'),
  createdBy: z.string().email('Invalid email').optional().nullable(),
});

// Update product schema (all fields optional)
export const UpdateProductSchema = CreateProductSchema.partial();

// Bulk update schema
export const BulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID required'),
  status: ProductStatusSchema,
});

// Validate affiliate URL against allowed domains
export function validateAffiliateUrl(url) {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, '');
    
    // Check if domain matches allowed patterns
    const isAllowed = ALLOWED_AFFILIATE_DOMAINS.some(allowed => 
      domain === allowed || domain.endsWith('.' + allowed)
    );
    
    if (!isAllowed) {
      throw new Error(`Affiliate domain not allowed: ${domain}`);
    }
    
    return true;
  } catch (error) {
    throw new Error('Invalid affiliate URL: ' + error.message);
  }
}
