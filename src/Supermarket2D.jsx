import React from 'react';

const Supermarket2D = () => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Shelf Section */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '40%',
                backgroundColor: '#a0a0a0',
                border: '5px solid #808080',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '20px',
                boxSizing: 'border-box',
                zIndex: 1,
            }}>
                {/* Products */}
                <div style={{ width: '80px', height: '100px', backgroundColor: 'red', border: '2px solid darkred', borderRadius: '5px' }}></div>
                <div style={{ width: '80px', height: '120px', backgroundColor: 'green', border: '2px solid darkgreen', borderRadius: '5px' }}></div>
                <div style={{ width: '80px', height: '90px', backgroundColor: 'blue', border: '2px solid darkblue', borderRadius: '5px' }}></div>
                <div style={{ width: '80px', height: '110px', backgroundColor: 'yellow', border: '2px solid darkgoldenrod', borderRadius: '5px' }}></div>
            </div>

            {/* Checkout Counter Section */}
            <div style={{
                width: '100%',
                height: '30%',
                backgroundColor: '#b0b0b0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
            }}>
                {/* Checkout Counter */}
                <div style={{
                    width: '70%',
                    height: '80%',
                    backgroundColor: '#8b4513', // Wood color
                    borderRadius: '10px 10px 0 0',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    boxSizing: 'border-box',
                }}>
                    {/* Conveyor Belt */}
                    <div style={{
                        width: '40%',
                        height: '30px',
                        backgroundColor: '#555',
                        borderRadius: '5px',
                        border: '2px solid #333',
                    }}></div>
                    {/* Cash Register */}
                    <div style={{
                        width: '20%',
                        height: '60%',
                        backgroundColor: '#333',
                        borderRadius: '5px',
                        border: '2px solid #222',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        padding: '10px 0',
                    }}>
                        <div style={{ width: '80%', height: '20%', backgroundColor: '#0f0', borderRadius: '3px' }}></div> {/* Screen */}
                        <div style={{ width: '80%', height: '15%', backgroundColor: '#ccc', borderRadius: '3px' }}></div> {/* Keypad */}
                    </div>
                </div>
                {/* Cashier */}
                <div style={{
                    position: 'absolute',
                    right: '10%',
                    bottom: '100%',
                    width: '80px',
                    height: '150px',
                    backgroundColor: '#6a0dad', // Purple color for cashier
                    borderRadius: '10px 10px 0 0',
                    border: '2px solid #4b0082',
                    zIndex: 3,
                }}></div>
            </div>
        </div>
    );
};

export default Supermarket2D;