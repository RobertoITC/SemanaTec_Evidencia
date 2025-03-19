import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure the data passed from Dashboard
    const { palette, imageURL } = location.state || {};

    // If someone hits /results manually without data, go home
    if (!palette || !imageURL) {
        navigate('/');
        return null;
    }

    // Example: Generate random positions for each color circle
    // (In a real scenario, you might have the backend return average x,y for each color cluster).
    const circles = palette.map((color, idx) => {
        const top = Math.random() * 60 + 20;     // 20% to 80% of container
        const left = Math.random() * 60 + 20;    // 20% to 80%
        return { color, top: `${top}%`, left: `${left}%` };
    });

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Left side: color palette and actions */}
            <div className="w-1/3 p-6">
                <h2 className="text-2xl font-bold mb-4">Palette</h2>
                <div className="flex space-x-2 items-center">
                    {palette.map((color, idx) => (
                        <div
                            key={idx}
                            style={{ backgroundColor: color }}
                            className="w-8 h-8 rounded-full border border-gray-400"
                            title={color}
                        />
                    ))}
                </div>

                {/* Example: Export or back buttons */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back
                    </button>
                    {/* Add an "Export" button or more functionality as you wish */}
                </div>
            </div>

            {/* Right side: image display with circles */}
            <div className="relative w-2/3 flex items-center justify-center bg-white">
                <img
                    src={imageURL}
                    alt="Analyzed"
                    className="max-w-full max-h-[80vh] object-cover"
                />

                {/* Absolute-positioned color circles */}
                {circles.map((c, i) => (
                    <div
                        key={i}
                        className="absolute w-8 h-8 rounded-full border-4 border-white"
                        style={{
                            backgroundColor: c.color,
                            top: c.top,
                            left: c.left,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}