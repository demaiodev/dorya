'use client';
export default function Page() {
    const soundSelections = [
        {
            label: "I'm not gonna sugarcoat it",
            value: 'sugarcoat',
            defaultChecked: true
        },
        {
            label: 'Dorya',
            value: 'dorya',
            defaultChecked: false
        }
    ];
    const imageSelections = [
        {
            label: 'Sugarcoat',
            value: 'sugarcoat',
            src: '/images/sugarcoat.jpg',
            defaultChecked: true
        },
        {
            label: 'Dorya',
            value: 'dorya',
            src: '/images/dorya.png',
            defaultChecked: false
        }
    ];
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
                                defaultChecked={sound.defaultChecked}
                                className="cursor-pointer"
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
                                defaultChecked={image.defaultChecked}
                                className="cursor-pointer"
                            />
                            <img src={image.src} alt={image.label} className="w-16 h-16" />
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
