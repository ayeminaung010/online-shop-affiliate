/**
 * Product Status Types & Configuration
 * 
 * To add a new status:
 * 1. Add it to the ProductStatus type
 * 2. Add its config to PRODUCT_STATUS_CONFIG
 * 3. Add its Myanmar label to lib/i18n/my.ts
 */

/** @typedef {'active' | 'need_recheck' | 'inactive' | 'low_confidence'} ProductStatus */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} platform
 * @property {string} category
 * @property {number} price
 * @property {number} oldPrice
 * @property {string} imageUrl
 * @property {string} affiliateUrl
 * @property {number} priority
 * @property {ProductStatus} status
 * @property {string} lastCheckedAt
 * @property {string} updatedAt
 */

/** Status visual configuration for badges & UI */
export const PRODUCT_STATUS_CONFIG = {
    active: {
        key: 'active',
        color: 'green',
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
    },
    need_recheck: {
        key: 'need_recheck',
        color: 'amber',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-800 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
    },
    inactive: {
        key: 'inactive',
        color: 'gray',
        bg: 'bg-gray-100 dark:bg-gray-800/50',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-700',
    },
    low_confidence: {
        key: 'low_confidence',
        color: 'purple',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-800 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
    },
};

/** All valid statuses */
export const ALL_STATUSES = Object.keys(PRODUCT_STATUS_CONFIG);

/**
 * Check if product hasn't been checked in over 24 hours
 * @param {string|null} lastCheckedAt
 * @returns {boolean}
 */
export function isStale(lastCheckedAt) {
    if (!lastCheckedAt) return true;
    const diff = Date.now() - new Date(lastCheckedAt).getTime();
    return diff > 24 * 60 * 60 * 1000;
}
