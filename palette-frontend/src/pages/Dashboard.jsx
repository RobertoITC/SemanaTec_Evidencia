import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColourfulText from '../components/ui/colourful-text.jsx';

export default function Dashboard() {
    const navigate = useNavigate();

    // Single-file approach; do not call .length on a File object
    const [selectedFile, setSelectedFile] = useState(null);

    // If your backend expects these, keep them; otherwise remove
    const [numColors, setNumColors] = useState(5);
    const [brightness] = useState(0);
    const [contrast] = useState(0);
    const [grayscale] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // We only need the first file
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        // again, single file
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsLoading(true);
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
            // Example: data.clusters => array of { hex, percentage, avg_x, avg_y }

            navigate('/results', {
                state: {
                    clusters: data.clusters,
                    imageURL: URL.createObjectURL(selectedFile),
                },
            });
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-50 p-6 relative">
            {/* Loading overlay if needed */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12 animate-spin" />
                </div>
            )}

            <h1 className="text-3xl font-bold mb-4">
                <ColourfulText text="Color Palette Extractor" color="blue" />
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Drag & Drop zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer"
                >
                    {selectedFile ? (
                        <p className="text-center font-semibold">File: {selectedFile.name}</p>
                    ) : (
                        <p className="text-center text-gray-500">
                            Drag & drop an image here, or click below to select one
                        </p>
                    )}
                </div>

                {/* Fallback file input */}
                <div>
                    <label className="block font-semibold mb-1">Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block"
                    />
                </div>

                {/* Show a small preview if a file is selected */}
                {selectedFile && (
                    <div className="mt-2">
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="preview"
                            className="max-w-xs border"
                        />
                    </div>
                )}

                {/* Number of colors field if required */}
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Extract Palette
                </button>
            </form>
        </div>
    );
}