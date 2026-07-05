import BorderGlow from './border-glow';

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
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

    );
}