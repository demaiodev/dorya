'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/images/dorya.png';
import { useRef, useEffect } from 'react';
import { VolumeSlider } from './volume-slider';

const navItems = [
    { linkText: 'Practice', href: '/' },
    { linkText: 'Explanation', href: '/ewgf' }
];

export function Header() {
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/dorya.mp3');
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleImageClick = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            const storedVolume = localStorage.getItem('volume');
            audioRef.current.volume = storedVolume ? parseFloat(storedVolume) : 0.75;
            audioRef.current.play().catch((e) => console.log('Audio playback failed:', e));
        }
    };

    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12">
            <Image
                width={75}
                height={75}
                src={logo}
                alt="Kazuya picture"
                onClick={handleImageClick}
                className="cursor-pointer"
            />
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className="inline-flex px-1.5 py-1 sm:px-3 sm:py-2">
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <VolumeSlider />
        </nav>
    );
}
