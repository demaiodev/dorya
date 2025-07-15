import { useState, useEffect } from 'react';

export function VolumeSlider() {
    const [volume, setVolume] = useState(() => {
        if (typeof window === 'undefined') return 0.75;
        const savedVolume = localStorage.getItem('volume');
        return savedVolume !== null ? parseFloat(savedVolume) : 0.75;
    });

    useEffect(() => {
        localStorage.setItem('volume', volume);
    }, [volume]);

    const handleVolumeChange = (event) => {
        setVolume(parseFloat(event.target.value));
    };

    return (
        <div className="ml-auto flex items-center gap-2">
            <label htmlFor="volume-slider" className="text-sm">
                Volume:
            </label>
            <input
                type="range"
                id="volumeSlider"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer ml-auto"
                style={{ accentColor: '#4f46e5' }}
            />
        </div>
    );
}
