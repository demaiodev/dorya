'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import buttonTwo from 'public/images/button-two.png';
import downArrow from 'public/images/down-arrow.png';
import forwardArrow from 'public/images/forward-arrow.png';
import downForwardArrow from 'public/images/down-forward-arrow.png';
import neutral from 'public/images/neutral.png';
import sugarcoat from 'public/images/sugarcoat.jpg';

// Constants
const MAX_FRAMES = 999;
const FRAME_RATE = 60;
const FRAME_DURATION = 1000 / FRAME_RATE;
const FADE_DURATION = 250;
const SUGARCOAT_DIMENSIONS = {
    width: 200,
    height: 200
};
const TRACKED_BUTTONS = [
    { index: 13, label: 'd', img: downArrow },
    { index: 15, label: 'f', img: forwardArrow },
    { index: 3, label: '2', img: buttonTwo }
];

export default function Page() {
    // State management
    const [gamepadState, setGamepadState] = useState({
        connected: false,
        gamepadId: '',
        buttons: [],
        currentFrame: 0,
        lastPressFrame: new Array(20).fill(-1),
        simultaneousPresses: [],
        hasStarted: false
    });
    const [showEffect, setShowEffect] = useState(false);
    const audioRef = useRef(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('/sounds/soundeffect.mp3');
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle effect animation timing
    useEffect(() => {
        if (showEffect) {
            const timer = setTimeout(() => {
                setShowEffect(false);
            }, FADE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [showEffect]);

    // Main gamepad handling
    useEffect(() => {
        const handleGamepadConnect = (event) => {
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

        // Event listeners for gamepad connection
        window.addEventListener('gamepadconnected', handleGamepadConnect);
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnect);

        let lastFrameTime = 0;

        // Handle visual and audio effects
        const handleSimultaneousPressEffects = () => {
            setShowEffect(true);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                const storedVolume = localStorage.getItem('volume');
                audioRef.current.volume = storedVolume ? parseFloat(storedVolume) : 0.75;
                audioRef.current.play().catch((e) => console.log('Audio playback failed:', e));
            }
        };

        // Main update loop
        const updateGamepadState = (currentTime) => {
            if (currentTime - lastFrameTime >= FRAME_DURATION) {
                const gamepads = navigator.getGamepads();
                const gamepad = gamepads[0];

                if (gamepad) {
                    setGamepadState((prev) => {
                        // Map gamepad button states to boolean array
                        const currentButtonStates = gamepad.buttons.map((button) => button.pressed);

                        // Frame management
                        let currentFrame = prev.currentFrame;
                        const hasAnyButtonPressed = currentButtonStates.some((isPressed) => isPressed);

                        // Update frame counter when buttons are pressed
                        if (hasAnyButtonPressed) {
                            currentFrame = currentFrame >= MAX_FRAMES ? 0 : currentFrame + 1;
                        }

                        // Track when each button was last pressed
                        const buttonPressFrames = [...prev.lastPressFrame];
                        const recentSimultaneousPresses = [...prev.simultaneousPresses];

                        // Detect newly pressed buttons and check for simultaneous presses
                        currentButtonStates.forEach((isPressed, buttonIndex) => {
                            const wasButtonPreviouslyPressed = prev.buttons[buttonIndex];
                            const isNewPress = isPressed && !wasButtonPreviouslyPressed;

                            if (isNewPress) {
                                // Record the frame when this button was pressed
                                buttonPressFrames[buttonIndex] = currentFrame;

                                // Check for other buttons pressed on the same frame
                                currentButtonStates.forEach((isOtherButtonPressed, otherButtonIndex) => {
                                    if (!isOtherButtonPressed || otherButtonIndex === buttonIndex) return;

                                    // Debugging output
                                    console.log('isPressed:', isPressed);
                                    console.log('buttonIndex:', buttonIndex);
                                    console.log('isOtherButtonPressed:', isOtherButtonPressed);
                                    console.log('otherButtonIndex:', otherButtonIndex);

                                    const isSameButton = buttonIndex === otherButtonIndex;
                                    const pressedOnSameFrame = buttonPressFrames[otherButtonIndex] === currentFrame;

                                    if (!isSameButton && isOtherButtonPressed && pressedOnSameFrame) {
                                        // Record simultaneous press
                                        const simultaneousPress = {
                                            buttons: [buttonIndex, otherButtonIndex],
                                            frame: currentFrame
                                        };
                                        recentSimultaneousPresses.push(simultaneousPress);
                                        handleSimultaneousPressEffects();
                                    }
                                });
                            }
                        });

                        // Keep only the 10 most recent simultaneous presses
                        const latestPresses = recentSimultaneousPresses.slice(-10);

                        return {
                            ...prev,
                            buttons: currentButtonStates,
                            currentFrame,
                            lastPressFrame: buttonPressFrames,
                            simultaneousPresses: latestPresses,
                            hasStarted: hasAnyButtonPressed
                        };
                    });

                    lastFrameTime = currentTime;
                }
            }

            requestAnimationFrame(updateGamepadState);
        };

        requestAnimationFrame(updateGamepadState);

        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnect);
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnect);
        };
    }, []);

    const fadeAnimation = {
        opacity: showEffect ? 1 : 0,
        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section className="flex flex-col gap-4">
                <h1 className="text-lg font-bold flex flex-col items-center">
                    {!gamepadState.connected && <>Connect a controller, then press any button to start.</>}
                </h1>
                {gamepadState.connected && (
                    <>
                        <div className="text-lg font-bold">Frame Counter: {gamepadState.currentFrame}</div>
                        <div style={fadeAnimation}>
                            <Image
                                src={sugarcoat}
                                alt="Sugarcoat effect"
                                width={SUGARCOAT_DIMENSIONS.width}
                                height={SUGARCOAT_DIMENSIONS.height}
                                className={`transition-opacity duration-${FADE_DURATION} ${
                                    showEffect ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {TRACKED_BUTTONS.map((button) => (
                                <div key={button.index}>
                                    <div
                                        className={`p-4 border rounded text-black flex items-center justify-center w-50 ${
                                            gamepadState.buttons[button.index] ? 'bg-indigo-500' : 'bg-indigo-900'
                                        }`}
                                    >
                                        <Image width={100} height={100} src={button.img} alt={button.img} />
                                    </div>

                                    <span className="text-xs block ">
                                        Last pressed on frame: {gamepadState.lastPressFrame[button.index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <Image width={50} height={50} src={forwardArrow} alt="Forward arrow" />
                            <Image width={50} height={50} src={neutral} alt="Tekken neutral star" />
                            <Image width={50} height={50} src={downArrow} alt="Down arrow" />
                            <Image width={50} height={50} src={downForwardArrow} alt="Down forward arrow" />
                            <Image width={50} height={50} src={buttonTwo} alt="Tekken button two" />
                        </div>
                        <div className="mt-4 text-sm">
                            <span className="font-bold">History:</span>
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
