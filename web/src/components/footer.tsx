import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, TwitterIcon, LinkedinIcon } from "@/components/ui/icons";

export default function Footer() {
    return (
        <footer className="bg-[#0B0F19] text-white border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-black tracking-tighter bg-linear-to-br from-white to-white/60 bg-clip-text text-transparent">
                                ASTRA.
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
                            Next-generation supply chain intelligence and predictive risk management for global energy security.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-white/40 hover:text-white transition-colors">
                                <TwitterIcon className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-white/40 hover:text-white transition-colors">
                                <GithubIcon className="w-5 h-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-white/40 hover:text-white transition-colors">
                                <LinkedinIcon className="w-5 h-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-white/40 hover:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Supply Chain Tracking', href: '#' },
                                { name: 'Predictive Analytics', href: '#' },
                                { name: 'Agent Infrastructure', href: '#' },
                                { name: 'Integrations API', href: '#' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-(--primary-color) text-sm transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'About Us', href: '#' },
                                { name: 'Careers', href: '#' },
                                { name: 'Blog', href: '#' },
                                { name: 'Contact', href: '#' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Privacy Policy', href: '#' },
                                { name: 'Terms of Service', href: '#' },
                                { name: 'Cookie Policy', href: '#' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        &copy; {new Date().getFullYear()} Astra Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}