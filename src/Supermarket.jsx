import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Box, Plane, PointerLockControls, Text, Cylinder, Sphere } from '@react-three/drei';
import { Physics, usePlane, useBox, useSphere, useContactMaterial } from '@react-three/cannon';
import * as THREE from 'three';

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

    useEffect(() => {
        api.velocity.subscribe((v) => (velocity.current = v));
    }, [api.velocity]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case 'KeyW':
                    setMovement((m) => ({ ...m, forward: true }));
                    break;
                case 'KeyS':
                    setMovement((m) => ({ ...m, backward: true }));
                    break;
                case 'KeyA':
                    setMovement((m) => ({ ...m, left: true }));
                    break;
                case 'KeyD':
                    setMovement((m) => ({ ...m, right: true }));
                    break;
                case 'Space':
                    setMovement((m) => ({ ...m, jump: true }));
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW':
                    setMovement((m) => ({ ...m, forward: false }));
                    break;
                case 'KeyS':
                    setMovement((m) => ({ ...m, backward: false }));
                    break;
                case 'KeyA':
                    setMovement((m) => ({ ...m, left: false }));
                    break;
                case 'KeyD':
                    setMovement((m) => ({ ...m, right: false }));
                    break;
                case 'Space':
                    setMovement((m) => ({ ...m, jump: false }));
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        camera.position.copy(ref.current.position);
        const speed = 3;
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0));
        const sideVector = new THREE.Vector3((movement.left ? 1 : 0) - (movement.right ? 1 : 0), 0, 0);

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

const Product = ({ position, color, shape = 'box' }) => {
    const [ref] = useBox(() => ({ mass: 1, position, args: [0.5, 0.5, 0.5] }));
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
                    <meshStandardMaterial attach="material" color={color} />
                </Box>
            );
        case 'cylinder':
            return (
                <Cylinder {...meshProps} args={[0.25, 0.25, 0.5, 32]}>
                    <meshStandardMaterial attach="material" color={color} />
                </Cylinder>
            );
        case 'sphere':
            return (
                <Sphere {...meshProps} args={[0.25, 32, 32]}>
                    <meshStandardMaterial attach="material" color={color} />
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
            <meshStandardMaterial map={map} color={color} transparent={transparent} opacity={opacity} side={side} />
        </mesh>
    );
};

const PhysicsBox = ({ position, args, material, map, color, castShadow, receiveShadow }) => {
    const [ref] = useBox(() => ({ position, args, material }));
    return (
        <mesh ref={ref} castShadow={castShadow} receiveShadow={receiveShadow}>
            <boxGeometry args={args} />
            <meshStandardMaterial map={map} color={color} />
        </mesh>
    );
};

const Environment = () => {
    const floorTexture = useLoader(THREE.TextureLoader, '/textures/floor.jpg');
    const shelfTexture = useLoader(THREE.TextureLoader, '/textures/shelf.jpg');
    const ceilingTexture = useLoader(THREE.TextureLoader, '/textures/ceiling.jpg');
    // Fallback for wall if not generated, or use a color
    // const wallTexture = useLoader(THREE.TextureLoader, '/textures/wall.jpg'); 

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
                args={[50, 50]}
                material="ground"
                map={floorTexture}
            />

            {/* Ceiling (Visual only, no physics needed usually, but can add if we want to limit jumping) */}
            <Plane rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]} args={[50, 50]} receiveShadow>
                <meshStandardMaterial attach="material" map={ceilingTexture} />
            </Plane>

            {/* Aisles */}
            <PhysicsBox
                position={[-2.5, 2, -10]}
                args={[1, 4, 20]}
                castShadow
                receiveShadow
                map={shelfTexture}
            />
            <PhysicsBox
                position={[2.5, 2, -10]}
                args={[1, 4, 20]}
                castShadow
                receiveShadow
                map={shelfTexture}
            />

            {/* Walls */}
            <PhysicsPlane
                position={[-10, 4, 0]}
                rotation={[0, Math.PI / 2, 0]}
                args={[50, 8]}
                material="wall"
                color="#f0f0f0"
                side={THREE.DoubleSide}
            />
            <PhysicsPlane
                position={[10, 4, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                args={[50, 8]}
                material="wall"
                color="#f0f0f0"
                side={THREE.DoubleSide}
            />
            <PhysicsPlane
                position={[0, 4, -25]}
                rotation={[0, 0, 0]}
                args={[20, 8]}
                material="wall"
                color="#f0f0f0"
                side={THREE.DoubleSide}
            />
            <PhysicsPlane
                position={[0, 4, 25]}
                rotation={[0, -Math.PI, 0]}
                args={[20, 8]}
                material="wall"
                color="#f0f0f0"
                side={THREE.DoubleSide}
            />
        </>
    )
}


const Supermarket = () => {
    const [isLocked, setIsLocked] = useState(false);

    const handleCanvasClick = () => {
        if (!isLocked) {
            setIsLocked(true);
        }
    };

    return (
        <Canvas onClick={handleCanvasClick} camera={{ fov: 75, position: [0, 1.6, 5] }} shadows>
            <color attach="background" args={['#e0e0e0']} />
            <ambientLight intensity={0.4} />
            <hemisphereLight skyColor={"#ffffff"} groundColor={"#444444"} intensity={0.5} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />
            <pointLight position={[0, 7, -10]} intensity={0.5} />
            <pointLight position={[0, 7, 0]} intensity={0.5} />

            <Physics gravity={[0, -50, 0]}>
                <Player />
                <React.Suspense fallback={null}>
                    <Environment />
                </React.Suspense>

                {/* Products */}
                {[...Array(10)].map((_, j) => (
                    <React.Fragment key={j}>
                        <Product position={[-2, 0.5, -18 + j * 2]} color="red" shape="box" />
                        <Product position={[-2, 1.5, -18 + j * 2]} color="blue" shape="cylinder" />
                        <Product position={[2, 0.5, -18 + j * 2]} color="green" shape="sphere" />
                    </React.Fragment>
                ))}
            </Physics>

            {isLocked ? (
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
            )}
        </Canvas>
    );
};

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

export default Supermarket;
