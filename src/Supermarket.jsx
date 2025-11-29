import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Box, Plane, PointerLockControls, Text, Cylinder, Sphere } from '@react-three/drei';
import { Physics, usePlane, useBox, useSphere, useContactMaterial } from '@react-three/cannon';
import * as THREE from 'three';

import MobileControls from './components/MobileControls';

const Player = () => {
    const { camera } = useThree();
    const [ref, api] = useSphere(() => ({ mass: 1, position: [0, 1, 0], args: [0.5], material: 'player' }));
    const velocity = useRef([0, 0, 0]);
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
    });

    // Mobile input refs
    const joystickRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        api.velocity.subscribe((v) => (velocity.current = v));
    }, [api.velocity]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case 'KeyW': setMovement((m) => ({ ...m, forward: true })); break;
                case 'KeyS': setMovement((m) => ({ ...m, backward: true })); break;
                case 'KeyA': setMovement((m) => ({ ...m, left: true })); break;
                case 'KeyD': setMovement((m) => ({ ...m, right: true })); break;
                case 'Space': setMovement((m) => ({ ...m, jump: true })); break;
                default: break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW': setMovement((m) => ({ ...m, forward: false })); break;
                case 'KeyS': setMovement((m) => ({ ...m, backward: false })); break;
                case 'KeyA': setMovement((m) => ({ ...m, left: false })); break;
                case 'KeyD': setMovement((m) => ({ ...m, right: false })); break;
                case 'Space': setMovement((m) => ({ ...m, jump: false })); break;
                default: break;
            }
        };

        // Custom Event Listeners for Mobile
        const handleJoystickMove = (e) => {
            joystickRef.current = e.detail;
        };

        const handleTouchLook = (e) => {
            const { x, y } = e.detail;
            const sensitivity = 0.005;
            camera.rotation.y -= x * sensitivity;
            // camera.rotation.x -= y * sensitivity; // Optional: vertical look
            // Clamp vertical look if needed, but for now just horizontal is safer to avoid flipping
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('joystick-move', handleJoystickMove);
        window.addEventListener('touch-look', handleTouchLook);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('joystick-move', handleJoystickMove);
            window.removeEventListener('touch-look', handleTouchLook);
        };
    }, [camera]);

    useFrame(() => {
        camera.position.copy(ref.current.position);
        const speed = 3;
        const direction = new THREE.Vector3();

        // Combine Keyboard and Joystick Input
        const frontInput = (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0) + joystickRef.current.y;
        const sideInput = (movement.left ? 1 : 0) - (movement.right ? 1 : 0) - joystickRef.current.x;

        const frontVector = new THREE.Vector3(0, 0, frontInput);
        const sideVector = new THREE.Vector3(sideInput, 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(speed)
            .applyEuler(camera.rotation);

        api.velocity.set(direction.x, velocity.current[1], direction.z);

        if (movement.jump && Math.abs(velocity.current[1]) < 0.05) {
            api.velocity.set(velocity.current[0], 5, velocity.current[2]);
        }
    });

    return <mesh ref={ref} />;
};

// Centralized Product Data (AI Awareness)
const PRODUCTS_DATA = [
    // Shelf 1 (Left) - Lettuce & Tomato
    { id: 's1-1', name: 'Lechuga', type: 'sphere', position: [-3, 0.525, -5], texture: 'lettuce' },
    { id: 's1-2', name: 'Tomate', type: 'sphere', position: [-3, 1.125, -5], texture: 'tomato' },
    { id: 's1-3', name: 'Lechuga', type: 'sphere', position: [-3, 1.725, -5], texture: 'lettuce' },
    { id: 's1-4', name: 'Tomate', type: 'sphere', position: [-3, 0.525, -5.4], texture: 'tomato' },
    { id: 's1-5', name: 'Lechuga', type: 'sphere', position: [-3, 1.125, -5.4], texture: 'lettuce' },
    { id: 's1-6', name: 'Tomate', type: 'sphere', position: [-3, 1.725, -5.4], texture: 'tomato' },

    // Shelf 2 (Center) - Lay's Chips
    { id: 's2-1', name: 'Papas Lays', type: 'box', position: [0, 0.525, -5], texture: 'lays' },
    { id: 's2-2', name: 'Papas Lays', type: 'box', position: [0, 1.125, -5], texture: 'lays' },
    { id: 's2-3', name: 'Papas Lays', type: 'box', position: [0, 1.725, -5], texture: 'lays' },
    { id: 's2-4', name: 'Papas Lays', type: 'box', position: [0, 0.525, -5.4], texture: 'lays' },
    { id: 's2-5', name: 'Papas Lays', type: 'box', position: [0, 1.125, -5.4], texture: 'lays' },
    { id: 's2-6', name: 'Papas Lays', type: 'box', position: [0, 1.725, -5.4], texture: 'lays' },

    // Shelf 3 (Right) - Mixed
    { id: 's3-1', name: 'Tomate', type: 'sphere', position: [3, 0.525, -5], texture: 'tomato' },
    { id: 's3-2', name: 'Lechuga', type: 'sphere', position: [3, 1.125, -5], texture: 'lettuce' },
    { id: 's3-3', name: 'Papas Lays', type: 'box', position: [3, 1.725, -5], texture: 'lays' },
    { id: 's3-4', name: 'Tomate', type: 'sphere', position: [3, 0.525, -5.4], texture: 'tomato' },
    { id: 's3-5', name: 'Lechuga', type: 'sphere', position: [3, 1.125, -5.4], texture: 'lettuce' },
    { id: 's3-6', name: 'Papas Lays', type: 'box', position: [3, 1.725, -5.4], texture: 'lays' },
];

const Product = ({ position, textureMap, shape = 'box' }) => {
    const [ref] = useBox(() => ({ mass: 0, position, args: [0.5, 0.5, 0.5] }));
    const handleClick = () => {
        console.log(`Product at position ${position} clicked`);
    };

    const meshProps = {
        ref,
        onClick: handleClick,
        castShadow: true,
        receiveShadow: true,
    };

    switch (shape) {
        case 'box':
            return (
                <Box {...meshProps} args={[0.5, 0.5, 0.5]}>
                    <meshStandardMaterial attach="material" map={textureMap} roughness={0.5} />
                </Box>
            );
        case 'cylinder':
            return (
                <Cylinder {...meshProps} args={[0.25, 0.25, 0.5, 32]}>
                    <meshStandardMaterial attach="material" map={textureMap} roughness={0.5} />
                </Cylinder>
            );
        case 'sphere':
            return (
                <Sphere {...meshProps} args={[0.25, 32, 32]}>
                    <meshStandardMaterial attach="material" map={textureMap} roughness={0.5} />
                </Sphere>
            );
        default:
            return null;
    }
}

const PhysicsPlane = ({ position, rotation, args, material, map, color, transparent, opacity, side }) => {
    const [ref] = usePlane(() => ({ position, rotation, material }));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={args} />
            <meshStandardMaterial map={map} color={color} transparent={transparent} opacity={opacity} side={side} roughness={0.8} />
        </mesh>
    );
};

const PhysicsBox = ({ position, args, material, map, color, castShadow, receiveShadow }) => {
    const [ref] = useBox(() => ({ position, args, material }));
    return (
        <mesh ref={ref} castShadow={castShadow} receiveShadow={receiveShadow}>
            <boxGeometry args={args} />
            <meshStandardMaterial map={map} color={color} roughness={0.6} />
        </mesh>
    );
};

// Detailed Shelf Component
const Shelf = ({ position, rotation = [0, 0, 0], texture }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Back Panel */}
            <PhysicsBox position={[0, 1.25, -0.25]} args={[2, 2.5, 0.1]} castShadow receiveShadow map={texture} />

            {/* Shelves */}
            {[0.2, 0.8, 1.4, 2.0].map((y, i) => (
                <PhysicsBox key={i} position={[0, y, 0.05]} args={[2, 0.05, 0.5]} castShadow receiveShadow color="#d0d0d0" />
            ))}

            {/* Base */}
            <PhysicsBox position={[0, 0.1, 0.05]} args={[2, 0.2, 0.5]} castShadow receiveShadow color="#333" />
        </group>
    );
};

// Detailed Checkout Counter
const CheckoutCounter = ({ position, rotation = [0, 0, 0], texture, registerTexture, cashRegisterTexture }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Main Body - Base del mostrador (más pequeño) */}
            <PhysicsBox position={[0, 0.4, 0]} args={[1.5, 0.8, 0.5]} castShadow receiveShadow map={texture} />

            {/* Superficie para apoyar alimentos - compacta */}
            <mesh position={[0, 0.82, 0.1]} receiveShadow>
                <boxGeometry args={[1.3, 0.03, 0.4]} />
                <meshStandardMaterial color="#8B7355" roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Caja Registradora - Cuerpo principal (a la derecha sobre la mesa) */}
            <mesh position={[0.3, 0.94, -0.05]} castShadow>
                <boxGeometry args={[0.3, 0.2, 0.25]} />
                <meshStandardMaterial map={cashRegisterTexture} roughness={0.4} metalness={0.3} />
            </mesh>

            {/* Caja Registradora - Pantalla */}
            <mesh position={[0.3, 1.08, 0]} rotation={[-0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.22, 0.18, 0.03]} />
                <meshStandardMaterial map={registerTexture} color="#fff" emissive="#4a4a4a" emissiveIntensity={0.2} />
            </mesh>

            {/* Caja Registradora - Teclado */}
            <mesh position={[0.3, 0.85, 0.08]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
                <planeGeometry args={[0.25, 0.2]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
            </mesh>

            {/* Cajón de dinero (detalle) */}
            <mesh position={[0.3, 0.88, 0.08]} castShadow>
                <boxGeometry args={[0.28, 0.05, 0.15]} />
                <meshStandardMaterial color="#333" roughness={0.5} metalness={0.2} />
            </mesh>
        </group>
    );
};

// 3D Cashier Component - Shorter Version
const Cashier = ({ position, rotation }) => {
    const scale = 0.42; // 20% más grande (was 0.35)
    return (
        <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
            {/* Legs */}
            <mesh position={[-0.2, 0.75, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.2, 0.75, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Torso (Shirt) */}
            <mesh position={[0, 1.9, 0]} castShadow>
                <boxGeometry args={[0.6, 0.8, 0.3]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Apron */}
            <mesh position={[0, 1.7, 0.16]} castShadow>
                <boxGeometry args={[0.5, 0.8, 0.05]} />
                <meshStandardMaterial color="green" />
            </mesh>
            <mesh position={[0, 2.1, 0.16]} castShadow>
                <boxGeometry args={[0.3, 0.3, 0.05]} />
                <meshStandardMaterial color="green" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <sphereGeometry args={[0.25]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>

            {/* Hair */}
            <mesh position={[0, 2.65, -0.05]} castShadow>
                <sphereGeometry args={[0.27]} />
                <meshStandardMaterial color="#553311" />
            </mesh>

            {/* Arms */}
            <mesh position={[-0.35, 1.9, 0]} rotation={[0, 0, 0.2]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.7]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0.35, 1.9, 0]} rotation={[0, 0, -0.2]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.7]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* Hands */}
            <mesh position={[-0.4, 1.5, 0]} castShadow>
                <sphereGeometry args={[0.09]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>
            <mesh position={[0.4, 1.5, 0]} castShadow>
                <sphereGeometry args={[0.09]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>
        </group>
    );
};

// 3D Shopper Component (NPC)
const Shopper = ({ position, rotation, shirtColor = "blue", pantsColor = "#333" }) => {
    const scale = 0.42;
    return (
        <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
            {/* Legs */}
            <mesh position={[-0.2, 0.75, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color={pantsColor} />
            </mesh>
            <mesh position={[0.2, 0.75, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color={pantsColor} />
            </mesh>

            {/* Torso (Shirt) */}
            <mesh position={[0, 1.9, 0]} castShadow>
                <boxGeometry args={[0.6, 0.8, 0.3]} />
                <meshStandardMaterial color={shirtColor} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <sphereGeometry args={[0.25]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>

            {/* Hair */}
            <mesh position={[0, 2.65, -0.05]} castShadow>
                <sphereGeometry args={[0.27]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Arms */}
            <mesh position={[-0.35, 1.9, 0]} rotation={[0, 0, 0.2]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.7]} />
                <meshStandardMaterial color={shirtColor} />
            </mesh>
            <mesh position={[0.35, 1.9, 0]} rotation={[0, 0, -0.2]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.7]} />
                <meshStandardMaterial color={shirtColor} />
            </mesh>
            {/* Hands */}
            <mesh position={[-0.4, 1.5, 0]} castShadow>
                <sphereGeometry args={[0.09]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>
            <mesh position={[0.4, 1.5, 0]} castShadow>
                <sphereGeometry args={[0.09]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>
        </group>
    );
};

// Decorative Sign Component
const Sign = ({ position, text, color = "#4a90e2" }) => {
    return (
        <group position={position}>
            {/* Hanging wires */}
            <mesh position={[-0.5, 0.5, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.5, 0.5, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Sign Board */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.5, 0.5, 0.1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Text */}
            <Text
                position={[0, 0, 0.06]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {text}
            </Text>
            <Text
                position={[0, 0, -0.06]}
                rotation={[0, Math.PI, 0]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {text}
            </Text>
        </group>
    );
};

// Simple Shopping Cart Component
const Cart = ({ position, rotation }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Basket */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.6, 0.4, 0.8]} />
                <meshStandardMaterial color="silver" wireframe />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.58, 0.38, 0.78]} />
                <meshStandardMaterial color="#888" transparent opacity={0.1} />
            </mesh>

            {/* Handle */}
            <mesh position={[0, 0.8, 0.45]}>
                <cylinderGeometry args={[0.02, 0.02, 0.5]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="red" />
            </mesh>

            {/* Wheels */}
            <mesh position={[-0.25, 0.1, 0.35]}>
                <cylinderGeometry args={[0.05, 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0.25, 0.1, 0.35]}>
                <cylinderGeometry args={[0.05, 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.25, 0.1, -0.35]}>
                <cylinderGeometry args={[0.05, 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0.25, 0.1, -0.35]}>
                <cylinderGeometry args={[0.05, 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>
    );
};

const Environment = () => {
    const floorTexture = useLoader(THREE.TextureLoader, '/textures/floor.jpg');
    const ceilingTexture = useLoader(THREE.TextureLoader, '/textures/ceiling.jpg');
    const realShelfTexture = useLoader(THREE.TextureLoader, '/textures/real_shelf.jpg');
    const realCounterTexture = useLoader(THREE.TextureLoader, '/textures/real_counter.jpg');
    const registerTexture = useLoader(THREE.TextureLoader, '/textures/register_screen.jpg');
    const cashRegisterTexture = useLoader(THREE.TextureLoader, '/textures/cash_register.jpg');

    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
    ceilingTexture.repeat.set(10, 10);

    return (
        <>
            {/* Floor */}
            <PhysicsPlane
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                args={[20, 20]}
                material="ground"
                map={floorTexture}
            />

            {/* Ceiling */}
            <Plane rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} args={[20, 20]} receiveShadow>
                <meshStandardMaterial attach="material" map={ceilingTexture} />
            </Plane>

            {/* Walls - Enclosing the 20x20 space */}
            <PhysicsPlane position={[0, 2.5, -10]} rotation={[0, 0, 0]} args={[20, 5]} material="wall" color="#f5f5f5" side={THREE.DoubleSide} />
            <PhysicsPlane position={[0, 2.5, 10]} rotation={[0, -Math.PI, 0]} args={[20, 5]} material="wall" color="#f5f5f5" side={THREE.DoubleSide} />
            <PhysicsPlane position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} args={[20, 5]} material="wall" color="#f5f5f5" side={THREE.DoubleSide} />
            <PhysicsPlane position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} args={[20, 5]} material="wall" color="#f5f5f5" side={THREE.DoubleSide} />

            {/* Original Shelves - Center Aisle */}
            <Shelf position={[-3, 0, -5]} texture={realShelfTexture} />
            <Shelf position={[0, 0, -5]} texture={realShelfTexture} />
            <Shelf position={[3, 0, -5]} texture={realShelfTexture} />

            {/* New Shelves - Left Aisle */}
            <Shelf position={[-7, 0, -2]} rotation={[0, Math.PI / 2, 0]} texture={realShelfTexture} />
            <Shelf position={[-7, 0, -5]} rotation={[0, Math.PI / 2, 0]} texture={realShelfTexture} />
            <Shelf position={[-7, 0, -8]} rotation={[0, Math.PI / 2, 0]} texture={realShelfTexture} />

            {/* New Shelves - Right Aisle */}
            <Shelf position={[7, 0, -2]} rotation={[0, -Math.PI / 2, 0]} texture={realShelfTexture} />
            <Shelf position={[7, 0, -5]} rotation={[0, -Math.PI / 2, 0]} texture={realShelfTexture} />
            <Shelf position={[7, 0, -8]} rotation={[0, -Math.PI / 2, 0]} texture={realShelfTexture} />

            {/* Checkout Counter - Entre el jugador y el NPC */}
            <CheckoutCounter position={[0, 0, -0.7]} texture={realCounterTexture} registerTexture={registerTexture} cashRegisterTexture={cashRegisterTexture} />

            {/* Cashier - Behind the counter */}
            <Cashier position={[0, 0, -1.5]} rotation={[0, 0, 0]} />

            {/* Ambient Shoppers */}
            <Shopper position={[-5, 0, -2]} rotation={[0, Math.PI / 2, 0]} shirtColor="red" />
            <Shopper position={[6, 0, -6]} rotation={[0, -Math.PI / 4, 0]} shirtColor="green" />
            <Shopper position={[-2, 0, 3]} rotation={[0, Math.PI, 0]} shirtColor="orange" />

            {/* Signs */}
            <Sign position={[-7, 3.5, -5]} text="Produce" color="#4CAF50" />
            <Sign position={[0, 3.5, -5]} text="Snacks" color="#FF9800" />
            <Sign position={[7, 3.5, -5]} text="Dairy" color="#2196F3" />

            {/* Shopping Carts */}
            <Cart position={[2, 0, 2]} rotation={[0, 0.5, 0]} />
            <Cart position={[3, 0, 2.5]} rotation={[0, 0.2, 0]} />
            <Cart position={[-8, 0, 8]} rotation={[0, -0.5, 0]} />
        </>
    )
}

const Materials = () => {
    useContactMaterial('ground', 'player', {
        friction: 0.8,
        restitution: 0.1,
    });
    useContactMaterial('wall', 'player', {
        friction: 0,
        restitution: 0,
    });
    return null;
}

const Supermarket = () => {
    const [isLocked, setIsLocked] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android|ipad|iphone|ipod/i.test(userAgent);
        };
        setIsMobile(checkMobile());
    }, []);

    // Load product textures (user-provided)
    const lettuceTexture = useLoader(THREE.TextureLoader, '/textures/lechuga_final.jpg');
    const tomatoTexture = useLoader(THREE.TextureLoader, '/textures/tomate.jpg');
    const laysTexture = useLoader(THREE.TextureLoader, '/textures/lays.jpg');

    const textures = {
        lettuce: lettuceTexture,
        tomato: tomatoTexture,
        lays: laysTexture
    };

    const handleCanvasClick = () => {
        if (!isLocked && !isMobile) {
            setIsLocked(true);
        }
    };

    // Mobile Event Dispatchers
    const onMobileMove = (data) => {
        window.dispatchEvent(new CustomEvent('joystick-move', { detail: data }));
    };

    const onMobileLook = (data) => {
        window.dispatchEvent(new CustomEvent('touch-look', { detail: data }));
    };

    // Extended Product Data including new shelves
    const ALL_PRODUCTS = [
        ...PRODUCTS_DATA,
        // Left Aisle Products
        { id: 'l1-1', name: 'Lechuga', type: 'sphere', position: [-7, 0.525, -2], texture: 'lettuce' },
        { id: 'l1-2', name: 'Tomate', type: 'sphere', position: [-7, 1.125, -2], texture: 'tomato' },
        { id: 'l1-3', name: 'Papas Lays', type: 'box', position: [-7, 1.725, -2], texture: 'lays' },
        { id: 'l2-1', name: 'Lechuga', type: 'sphere', position: [-7, 0.525, -5], texture: 'lettuce' },
        { id: 'l2-2', name: 'Tomate', type: 'sphere', position: [-7, 1.125, -5], texture: 'tomato' },
        { id: 'l2-3', name: 'Papas Lays', type: 'box', position: [-7, 1.725, -5], texture: 'lays' },

        // Right Aisle Products
        { id: 'r1-1', name: 'Papas Lays', type: 'box', position: [7, 0.525, -2], texture: 'lays' },
        { id: 'r1-2', name: 'Papas Lays', type: 'box', position: [7, 1.125, -2], texture: 'lays' },
        { id: 'r1-3', name: 'Papas Lays', type: 'box', position: [7, 1.725, -2], texture: 'lays' },
        { id: 'r2-1', name: 'Tomate', type: 'sphere', position: [7, 0.525, -5], texture: 'tomato' },
        { id: 'r2-2', name: 'Tomate', type: 'sphere', position: [7, 1.125, -5], texture: 'tomato' },
        { id: 'r2-3', name: 'Tomate', type: 'sphere', position: [7, 1.725, -5], texture: 'tomato' },
    ];

    return (
        <>
            {isMobile && <MobileControls onMove={onMobileMove} onLook={onMobileLook} />}
            <Canvas onClick={handleCanvasClick} camera={{ fov: 60, position: [0, 1.7, 5] }} shadows>
                {/* Improved Lighting */}
                <color attach="background" args={['#f0f0f0']} />
                <ambientLight intensity={0.6} color="#fff0e0" />
                <hemisphereLight skyColor={"#ffffff"} groundColor={"#444444"} intensity={0.4} />

                {/* Main Directional Light (Sun/Overhead) */}
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-left={-15}
                    shadow-camera-right={15}
                    shadow-camera-top={15}
                    shadow-camera-bottom={-15}
                    shadow-bias={-0.0001}
                />

                {/* Point Lights for interior ambiance */}
                <pointLight position={[0, 4, -5]} intensity={0.5} distance={15} decay={2} color="#fff5cc" />
                <pointLight position={[0, 4, 2]} intensity={0.5} distance={15} decay={2} color="#fff5cc" />

                <Physics gravity={[0, -50, 0]}>
                    <Materials />
                    <Player />
                    <React.Suspense fallback={null}>
                        <Environment />
                    </React.Suspense>

                    {/* Products - Rendered from Centralized Data */}
                    {ALL_PRODUCTS.map((product) => (
                        <Product
                            key={product.id}
                            position={product.position}
                            shape={product.type}
                            textureMap={textures[product.texture]}
                        />
                    ))}

                </Physics>

                {!isMobile && (isLocked ? (
                    <PointerLockControls />
                ) : (
                    <Text
                        position={[0, 0, -2]}
                        fontSize={0.5}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                    >
                        Click to start
                    </Text>
                ))}
            </Canvas>
        </>
    );
};

export default Supermarket;
