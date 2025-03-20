import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    // We expect { clusters, imageURL } in location.state
    const { clusters, imageURL } = location.state || {};

    // If missing data, go home
    if (!clusters || !imageURL) {
        navigate('/');
        console.log('No data found in location state.');
        return null;
    }

    return (
        <div className="h-screen w-screen bg-gray-100 flex">
            {/* Left side: color palette & info */}
            <div className="w-1/3 p-6">
                <h2 className="text-2xl font-bold mb-4">Palette</h2>
                <div className="space-y-3">
                    {clusters.map((c, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                            {/* Swatch */}
                            <div
                                className="w-8 h-8 rounded-full border border-gray-400"
                                style={{ backgroundColor: c.hex }}
                                title={c.hex}
                            />
                            {/* Show HEX and percentage */}
                            <span className="text-gray-700">
                {c.hex} – {c.percentage.toFixed(1)}%
              </span>
                        </div>
                    ))}
                </div>

                {/* Go back */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Right side: image with color circles */}
            <div className="relative w-2/3 flex items-center justify-center bg-white">
                <img
                    src={imageURL}
                    alt="Analyzed"
                    className="max-w-full max-h-[80vh] object-cover"
                />

                {/* Circles at avg_x, avg_y */}
                {clusters.map((c, i) => (
                    <div
                        key={i}
                        className="absolute w-8 h-8 rounded-full border-4 border-white"
                        title={`${c.hex} – ${c.percentage.toFixed(1)}%`}
                        style={{
                            backgroundColor: c.hex,
                            top: `${c.avg_y * 100}%`,
                            left: `${c.avg_x * 100}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}