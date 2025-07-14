'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import buttonTwo from 'public/images/button-two.png';
import downArrow from 'public/images/down-arrow.png';
import forwardArrow from 'public/images/forward-arrow.png';
import downForwardArrow from 'public/images/down-forward-arrow.png';
import neutral from 'public/images/neutral.png';

const MAX_FRAMES = 999;

export default function Page() {
    const [gamepadState, setGamepadState] = useState({
        connected: false,
        gamepadId: '',
        buttons: [],
        currentFrame: 0,
        lastPressFrame: new Array(20).fill(-1),
        simultaneousPresses: [],
        hasStarted: false
    });

    useEffect(() => {
        const handleGamepadConnect = (event) => {
            console.log(event.gamepad);
            setGamepadState((prev) => ({
                ...prev,
                connected: true,
                gamepadId: event.gamepad.id
            }));
        };

        const handleGamepadDisconnect = () => {
            setGamepadState({
                connected: false,
                gamepadId: '',
                buttons: [],
                currentFrame: 0,
                lastPressFrame: new Array(20).fill(-1),
                simultaneousPresses: [],
                hasStarted: false
            });
        };

        window.addEventListener('gamepadconnected', handleGamepadConnect);
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnect);

        const updateGamepadState = () => {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[0];

            if (gamepad) {
                setGamepadState((prev) => {
                    const newButtons = gamepad.buttons.map((button) => button.pressed);
                    let newFrame = prev.currentFrame;
                    const newLastPressFrame = [...prev.lastPressFrame];
                    const newSimultaneousPresses = [...prev.simultaneousPresses];
                    let newHasStarted = prev.hasStarted;

                    // Start counting on first button press
                    if (!newHasStarted && newButtons.some((button) => button)) {
                        newHasStarted = true;
                    }

                    // Only increment frame if we've started counting
                    if (newHasStarted) {
                        if (newFrame >= MAX_FRAMES) {
                            newFrame = 0;
                        } else {
                            newFrame++;
                        }
                    }

                    // Update last press frame for newly pressed buttons
                    newButtons.forEach((pressed, index) => {
                        if (pressed && !prev.buttons[index]) {
                            newLastPressFrame[index] = newFrame;

                            // Check for simultaneous presses
                            newButtons.forEach((otherPressed, otherIndex) => {
                                if (
                                    otherIndex !== index &&
                                    otherPressed &&
                                    newLastPressFrame[otherIndex] === newFrame
                                ) {
                                    newSimultaneousPresses.push({
                                        buttons: [index, otherIndex],
                                        frame: newFrame
                                    });
                                }
                            });
                        }
                    });

                    return {
                        ...prev,
                        buttons: newButtons,
                        currentFrame: newFrame,
                        lastPressFrame: newLastPressFrame,
                        simultaneousPresses: newSimultaneousPresses.slice(-10),
                        hasStarted: newHasStarted
                    };
                });
            }

            requestAnimationFrame(updateGamepadState);
        };

        updateGamepadState();

        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnect);
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnect);
        };
    }, []);

    const TRACKED_BUTTONS = [
        { index: 13, label: 'd', img: 'downArrow' },
        { index: 15, label: 'f', img: 'forwardArrow' },
        { index: 3, label: '2', img: 'buttonTwo' }
    ];

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section className="flex flex-col gap-4">
                <h1 className="text-lg font-bold pb-12">
                    {gamepadState.connected
                        ? `Connected: ${gamepadState.gamepadId}`
                        : 'Please connect a gamepad or press any button to start.'}
                </h1>
                {gamepadState.connected && (
                    <>
                        <div className="text-lg font-bold">Frame Counter: {gamepadState.currentFrame}</div>
                        <div className="grid grid-cols-3 gap-2">
                            {TRACKED_BUTTONS.map((button) => {
                                return (
                                    <div
                                        key={button.index}
                                        className={`p-2 border rounded text-black ${
                                            gamepadState.buttons[button.index] ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                    >
                                        {button.label}
                                        {gamepadState.buttons[button.index] && (
                                            <span className="text-xs block">
                                                Frame: {gamepadState.lastPressFrame[button.index]}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <Image width={75} height={75} src={forwardArrow} alt="Forward arrow" />
                            <Image width={75} height={75} src={neutral} alt="Tekken neutral star" />
                            <Image width={75} height={75} src={downArrow} alt="Down arrow" />
                            <Image width={75} height={75} src={downForwardArrow} alt="Down forward arrow" />
                            <Image width={75} height={75} src={buttonTwo} alt="Tekken button two" />
                        </div>
                        <div className="mt-4">
                            <h2 className="font-bold">Successful EWGFs:</h2>
                            <ol>
                                {gamepadState.simultaneousPresses
                                    .filter((press) =>
                                        press.buttons.every((btn) =>
                                            TRACKED_BUTTONS.some((tracked) => tracked.index === btn)
                                        )
                                    )
                                    .map((press, i) => {
                                        const labels = press.buttons.map(
                                            (btn) => TRACKED_BUTTONS.find((tracked) => tracked.index === btn)?.label
                                        );
                                        return (
                                            <li key={i}>
                                                {i + 1}. {labels.join(' & ')} on frame {press.frame}
                                            </li>
                                        );
                                    })}
                            </ol>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
