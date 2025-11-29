import React, { useState, useEffect, useRef } from 'react';

const MobileControls = ({ onMove, onLook }) => {
    const joystickRef = useRef(null);
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const initialTouchPos = useRef({ x: 0, y: 0 });

    // Joystick Logic
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        initialTouchPos.current = { x: touch.clientX, y: touch.clientY };
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - initialTouchPos.current.x;
        const deltaY = touch.clientY - initialTouchPos.current.y;

        // Clamp joystick movement
        const maxDist = 40;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const clampedDist = Math.min(distance, maxDist);
        const angle = Math.atan2(deltaY, deltaX);

        const x = Math.cos(angle) * clampedDist;
        const y = Math.sin(angle) * clampedDist;

        setJoystickPos({ x, y });

        // Normalize output -1 to 1
        onMove({ x: x / maxDist, y: y / maxDist });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setJoystickPos({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
    };

    // Look Logic (Right side of screen)
    const handleLookMove = (e) => {
        // Prevent default to stop scrolling
        // e.preventDefault(); 
        const touch = e.touches[0];
        // Simple sensitivity factor
        const movementX = e.movementX || (touch.clientX - (e.target.lastClientX || touch.clientX));
        const movementY = e.movementY || (touch.clientY - (e.target.lastClientY || touch.clientY));

        e.target.lastClientX = touch.clientX;
        e.target.lastClientY = touch.clientY;

        onLook({ x: movementX, y: movementY });
    };

    const handleLookStart = (e) => {
        const touch = e.touches[0];
        e.target.lastClientX = touch.clientX;
        e.target.lastClientY = touch.clientY;
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Let clicks pass through to canvas for selection
            zIndex: 10
        }}>
            {/* Joystick Zone (Left Bottom) */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '32vh', // Above chat (30vh)
                    left: '20px',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    pointerEvents: 'auto',
                    touchAction: 'none'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
                    transition: isDragging ? 'none' : 'transform 0.2s'
                }} />
            </div>

            {/* Look Zone (Right Side) - Invisible */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '50%',
                    height: '60%', // Avoid chat area
                    pointerEvents: 'auto',
                    touchAction: 'none'
                }}
                onTouchStart={handleLookStart}
                onTouchMove={handleLookMove}
            />
        </div>
    );
};

export default MobileControls;
