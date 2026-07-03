"use client";

import { MENU_ITEMS, SOCIAL_ITEMS } from '@/lib/navigate';
import StaggeredMenu from './ui/staggered-menu';

export default function Sidebar() {
    return (
        <div className="h-screen bg-[var(--primary-bg-color)]">
            <StaggeredMenu
                position="left"
                isFixed={true}
                items={MENU_ITEMS}
                socialItems={SOCIAL_ITEMS}
                displaySocials
                displayItemNumbering={true}
                menuButtonColor="var(--primary-text-color)"
                openMenuButtonColor="var(--primary-text-color)"
                changeMenuColorOnOpen={true}
                colors={['var(--secondary-color)', 'var(--primary-color)']}
                logoUrl="/logo.svg"
                accentColor="var(--primary-color)"
                onMenuOpen={() => { }}
                onMenuClose={() => { }}
            />
        </div>
    );
}