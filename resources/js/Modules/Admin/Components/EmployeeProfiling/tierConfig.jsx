// resources/js/Modules/Admin/Components/Profiling/tierConfig.jsx

export const TIER_ORDER = ['executive', 'management', 'staff'];

const DEFAULT_CFG = {
    badge:  'bg-gray-50 text-gray-600 border-gray-200',
    dot:    'bg-gray-400',
    label:  'text-gray-500',
    header: 'bg-gray-50/60 border-b border-gray-100',
    row:    'hover:bg-gray-50',
    icon:   'text-gray-200 group-hover:text-gray-500',
    pill:   'bg-gray-100 text-gray-600',
};

export const TIER_CONFIG = {
    executive: {
        badge:  'bg-purple-50 text-purple-700 border-purple-200',
        dot:    'bg-purple-500',
        label:  'text-purple-700',
        header: 'bg-purple-50/60 border-b border-purple-100',
        row:    'hover:bg-purple-50',
        icon:   'text-purple-300 group-hover:text-purple-600',
        pill:   'bg-purple-100 text-purple-700',
    },
    management: {
        badge:  'bg-blue-50 text-blue-700 border-blue-200',
        dot:    'bg-blue-500',
        label:  'text-blue-700',
        header: 'bg-blue-50/60 border-b border-blue-100',
        row:    'hover:bg-blue-50',
        icon:   'text-blue-300 group-hover:text-blue-600',
        pill:   'bg-blue-100 text-blue-700',
    },
    staff: {
        badge:  'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot:    'bg-emerald-500',
        label:  'text-emerald-700',
        header: 'bg-emerald-50/60 border-b border-emerald-100',
        row:    'hover:bg-emerald-50',
        icon:   'text-emerald-300 group-hover:text-emerald-600',
        pill:   'bg-emerald-100 text-emerald-700',
    },
};

export function tierCfg(tier) {
    return TIER_CONFIG[tier] ?? DEFAULT_CFG;
}

export function tierLabel(tier) {
    return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : '';
}