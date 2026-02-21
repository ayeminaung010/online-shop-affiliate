import { Badge } from '@/components/ui/badge';
import { PRODUCT_STATUS_CONFIG } from '@/lib/types';
import { t } from '@/lib/i18n/my';

/**
 * Reusable status badge component.
 * @param {{ status: string, className?: string }} props
 */
export function StatusBadge({ status, className = '' }) {
    const config = PRODUCT_STATUS_CONFIG[status] || PRODUCT_STATUS_CONFIG.active;
    const label = t(`status.${status}`);

    return (
        <Badge
            variant="outline"
            className={`${config.bg} ${config.text} ${config.border} font-semibold text-xs ${className}`}
        >
            {label}
        </Badge>
    );
}
