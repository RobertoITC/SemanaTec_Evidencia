import React, { useState } from 'react';
import ColourfulText from '../components/ui/colourful-text.jsx';

export default function Dashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [numColors, setNumColors] = useState(5);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [grayscale, setGrayscale] = useState(false);

    const [palette, setPalette] = useState([]);

    // Drag & Drop handlers
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };

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
        <div className="h-screen w-screen bg-white p-6">
            <div className="flex flex-col items-left justify-center border-b-2 mb-6 border-gray-200">
                <h1 className="text-3xl font-bold mb-4">
                    <ColourfulText text="Color Palette Extractor" color="blue" />
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    {/* Left Section: Text */}
                    <div className="w-1/2">
                        <p className="text-lg font-medium text-gray-500">
                            Upload your image to extract the color palette
                        </p>
                    </div>

                    {/* Right Section: Drag and Drop */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="w-1/2 border-1 border-white rounded-lg p-6 cursor-pointer text-lg font-medium h-80 shadow-lg"

                    >
                        {selectedFile ? (
                            <p className="text-center font-semibold">File: {selectedFile.name}</p>
                        ) : (
                            <p className="text-center text-gray-500">
                                Drag & drop an image here, or click below to select
                            </p>
                        )}
                    </div>
                </div>

                {/* Show image preview if available */}
                {selectedFile && (
                    <div className="mt-2">
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="preview"
                            className="max-w-xs border"
                        />
                    </div>
                )}

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
                            <div
                                key={idx}
                                className="w-16 h-16 border"
                                style={{ backgroundColor: color }}
                            >
                                {/* If the backend returns percentages, you could display them here. */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
