import BorderGlow from './border-glow';

export default function Card({ children, className, variant = "glow" }: { children: React.ReactNode; className?: string, variant?: "glow" | "solid" }) {
    return variant === "glow" ? (
        <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="--primary-bg-color"
            borderRadius={28}
            glowRadius={0}
            glowIntensity={0}
            coneSpread={25}
            animated={false}
            colors={['var(--primary-color)', 'var(--secondary-color)', '#38bdf8']}
        >
            <div className={className}>
                {children}
            </div>
        </BorderGlow>
    ) : (
        <div className={`rounded-[28px] border border-(--border-color) bg-(--surface-color) shadow-sm ${className || ""}`.trim()}>
            {children}
        </div>
    );
}