'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [gamepadState, setGamepadState] = useState({
        connected: false,
        gamepadId: '',
        buttons: []
    });

    useEffect(() => {
        const handleGamepadConnect = (event) => {
            setGamepadState(prev => ({
                ...prev,
                connected: true,
                gamepadId: event.gamepad.id
            }));
        };

        const handleGamepadDisconnect = () => {
            setGamepadState({
                connected: false,
                gamepadId: '',
                buttons: []
            });
        };

        window.addEventListener("gamepadconnected", handleGamepadConnect);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

        const updateGamepadState = () => {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[0];

            if (gamepad) {
                setGamepadState(prev => ({
                    ...prev,
                    buttons: gamepad.buttons.map(button => button.pressed)
                }));
            }

            requestAnimationFrame(updateGamepadState);
        };

        updateGamepadState();

        return () => {
            window.removeEventListener("gamepadconnected", handleGamepadConnect);
            window.removeEventListener("gamepaddisconnected", handleGamepadDisconnect);
        };
    }, []);

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">
                    {gamepadState.connected 
                        ? `Connected: ${gamepadState.gamepadId}` 
                        : 'No gamepad connected'}
                </h1>
                <div className="grid grid-cols-4 gap-2">
                    {gamepadState.buttons.map((pressed, index) => (
                        <div 
                            key={index}
                            className={`p-2 border rounded text-black ${pressed ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                            Button {index}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}