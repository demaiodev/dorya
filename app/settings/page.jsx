'use client';
import { useRef, useState, useEffect } from 'react';

export default function Page() {
    // Use state to track selected values
    const [selectedSound, setSelectedSound] = useState('sugarcoat');
    const [selectedImage, setSelectedImage] = useState('sugarcoat');

    // Load saved values on component mount
    useEffect(() => {
        const savedSound = localStorage.getItem('selectedSound');
        const savedImage = localStorage.getItem('selectedImage');
        if (savedSound) setSelectedSound(savedSound);
        if (savedImage) setSelectedImage(savedImage);
    }, []);

    const soundSelections = [
        {
            label: "I'm not gonna sugarcoat it",
            value: 'sugarcoat'
        },
        {
            label: 'Dorya',
            value: 'dorya'
        }
    ];

    const imageSelections = [
        {
            label: 'Sugarcoat',
            value: 'sugarcoat.jpg',
            src: '/images/sugarcoat.jpg'
        },
        {
            label: 'Dorya',
            value: 'dorya.png',
            src: '/images/dorya.png'
        }
    ];

    const handleSoundChange = (e) => {
        const value = e.target.value;
        setSelectedSound(value);
        localStorage.setItem('selectedSound', value);
    };

    const handleImageChange = (e) => {
        const value = e.target.value;
        setSelectedImage(value);
        localStorage.setItem('selectedImage', value);
    };

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <main className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Settings</h1>
                <section className="flex flex-col gap-4">
                    <h3>Sound Selection</h3>
                    {soundSelections.map((sound) => (
                        <div key={sound.value} className="flex items-center gap-2 p-1">
                            <input
                                type="radio"
                                id={sound.value}
                                name="sound"
                                value={sound.value}
                                checked={selectedSound === sound.value}
                                className="cursor-pointer"
                                onChange={handleSoundChange}
                            />
                            <label htmlFor={sound.value} className="cursor-pointer">
                                {sound.label}
                            </label>
                        </div>
                    ))}
                </section>
                <section>
                    <h3>Image Selection</h3>
                    {imageSelections.map((image) => (
                        <div key={image.value} className="flex items-center gap-2 p-1">
                            <input
                                type="radio"
                                id={image.value}
                                name="image"
                                value={image.value}
                                checked={selectedImage === image.value}
                                className="cursor-pointer"
                                onChange={handleImageChange}
                            />
                            <img src={image.src} alt={image.label} className="w-16 h-16" />
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
