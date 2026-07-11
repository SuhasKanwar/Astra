"use client";

import { SIDEBAR_ITEMS, SIDEBAR_SOCIAL_ITEMS } from '@/lib/navigate';
import StaggeredMenu from './ui/staggered-menu';

interface SidebarProps {
    onOpen?: () => void;
    onClose?: () => void;
}

export default function Sidebar({ onOpen, onClose }: SidebarProps) {
    return (
        <StaggeredMenu
            position="left"
            isFixed={true}
            items={SIDEBAR_ITEMS}
            socialItems={SIDEBAR_SOCIAL_ITEMS}
            displaySocials
            displayItemNumbering={true}
            menuButtonColor="var(--primary-text-color)"
            openMenuButtonColor="var(--primary-text-color)"
            changeMenuColorOnOpen={true}
            colors={['var(--secondary-color)', 'var(--primary-color)']}
            renderLogo
            logoUrl="/logo.svg"
            accentColor="var(--primary-color)"
            onMenuOpen={onOpen}
            onMenuClose={onClose}
        />
    );
}