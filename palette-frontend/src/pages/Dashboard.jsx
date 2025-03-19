import React, { useState } from 'react';
import ColourfulText from '../components/ui/colourful-text.jsx';

//C:\Users\hanni\WebstormProjects\SemanaTec_Evidencia\palette-frontend\src\components\ui\colourful-text.jsx

export default function Dashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [numColors, setNumColors] = useState(5);
    // Mantén los estados para filtros aunque ya no los mostremos en la UI:
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

        // Estos siguen presentes pero ahora se aplican únicamente en backend:
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
                            Drag & drop an image here, or click below to select
                        </p>
                    )}
                </div>

                {/* Fallback File Upload (optional) */}
                <div>
                    <label className="block font-semibold mb-1">Upload Image (Fallback):</label>
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="block"
                    />
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

                {/*
                  Sección de filtros removida de la UI pero las variables siguen existiendo arriba
                  y se envían al backend internamente.
                */}

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