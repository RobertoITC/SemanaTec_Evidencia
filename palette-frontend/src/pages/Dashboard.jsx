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
        <div className="h-screen w-screen bg-gray-50 p-6 relative flex">


            {/* Loading overlay if needed */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12 animate-spin" />
                </div>
            )}


            {/* Left side: Text and Form */}
            <div className="flex flex-col items-center justify-center w-1/2 pl-10 h-full">

                <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center justify-center">
                    {/* Textual Information */}



                        <label className="block font-semibold mb-1">Upload your image to extract the color palette</label>
                        <label className="block font-semibold mb-1">Number of Colors to Extract:</label>
                        <input
                            type="number"
                            value={numColors}
                            onChange={(e) => setNumColors(e.target.value)}
                            className="border rounded p-1"
                            min="1"
                        />


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Extract Palette
                    </button>
                </form>
            </div>
            <div className="h-screen w-[50%] flex flex-col items-center justify-center ">
            {/* Right side: Image Upload & Drag-and-Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-[70%] h-64 border border-white rounded-lg p-6 cursor-pointer flex items-center justify-center shadow-2xl ml-auto mr-auto"
            >
                {selectedFile ? (
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected file"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <p className="text-center text-gray-500">
                        Drag & drop an image here, or click below to select one
                    </p>
                )}
            </div>
            </div>
        </div>
    );
}
