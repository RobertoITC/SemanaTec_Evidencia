import React, { useState } from 'react';

export default function Dashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [numColors, setNumColors] = useState(5);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [grayscale, setGrayscale] = useState(false);
    const [palette, setPalette] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        // Build FormData
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('n_colors', numColors);
        formData.append('brightness', brightness);
        formData.append('contrast', contrast);
        formData.append('grayscale', grayscale);

        try {
            const response = await fetch('http://127.0.0.1:5000/extract_palette', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setPalette(data.palette);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-4">Color Palette Extractor</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Upload */}
                <div>
                    <label className="block font-semibold mb-1">Upload Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="block"
                    />
                </div>

                {/* Number of Colors */}
                <div>
                    <label className="block font-semibold mb-1">
                        Number of Colors to Extract:
                    </label>
                    <input
                        type="number"
                        value={numColors}
                        onChange={(e) => setNumColors(e.target.value)}
                        className="border rounded p-1"
                        min="1"
                    />
                </div>

                {/* Brightness */}
                <div>
                    <label className="block font-semibold mb-1">Brightness:</label>
                    <input
                        type="range"
                        value={brightness}
                        onChange={(e) => setBrightness(e.target.value)}
                        min="-100"
                        max="100"
                        className="w-full"
                    />
                    <span>{brightness}</span>
                </div>

                {/* Contrast */}
                <div>
                    <label className="block font-semibold mb-1">Contrast:</label>
                    <input
                        type="range"
                        value={contrast}
                        onChange={(e) => setContrast(e.target.value)}
                        min="-100"
                        max="100"
                        className="w-full"
                    />
                    <span>{contrast}</span>
                </div>

                {/* Grayscale */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={grayscale}
                        onChange={(e) => setGrayscale(e.target.checked)}
                    />
                    <label className="font-semibold">Grayscale</label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Extract Palette
                </button>
            </form>

            {/* Palette Display */}
            {palette.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-2">Palette:</h2>
                    <div className="flex space-x-2">
                        {palette.map((color, idx) => (
                            <div key={idx} className="w-16 h-16 border" style={{ backgroundColor: color }}>
                                {/* Empty – color swatch */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

