import axios from 'axios';
import React, { useState } from 'react';

const WorkCulture = () => {
  const [base64String, setBase64String] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoBase64, setVideoBase64] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Function to convert PDF to Base64
  const convertPDFToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const binaryString = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '');
        const base64String = btoa(binaryString);
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Function to convert Video to Base64
  const convertVideoToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const binaryString = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '');
        const base64String = btoa(binaryString);
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Function to convert Base64 to Video
  const convertBase64ToVideo = (base64String, fileName = 'video.mp4', mimeType = 'video/mp4') => {
    return new Promise((resolve, reject) => {
      try {
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const file = new File([blob], fileName, { type: mimeType });
        resolve({ blob, file });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Function to handle PDF file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        const base64 = await convertPDFToBase64(file);
        setBase64String(base64);
        console.log("Base 64 code of PDF is", base64);
        alert('PDF converted to Base64!');
      } catch (error) {
        console.error('Error converting PDF to Base64:', error);
      }
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  // Function to handle Video file upload
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      try {
        const base64 = await convertVideoToBase64(file);
        setVideoBase64(base64);
        console.log("Base 64 code of Video is", base64);
        alert('Video converted to Base64!');
      } catch (error) {
        console.error('Error converting Video to Base64:', error);
      }
    } else {
      alert('Please select a valid video file.');
    }
  };

  // Function to convert Base64 back to PDF
  const handleBase64ToPDF = () => {
    if (base64String) {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } else {
      alert('No Base64 string available to convert.');
    }
  };

  // Function to convert Base64 back to Video
  const handleBase64ToVideo = async () => {
    if (videoBase64) {
      try {
        const { blob } = await convertBase64ToVideo(videoBase64);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error converting Base64 to Video:', error);
        alert('An error occurred during the conversion process.');
      }
    } else {
      alert('No Base64 string available to convert.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">PDF & Video Upload & Convert</h1>

      <input 
        type="file" 
        accept="application/pdf" 
        className="mb-4 p-2 border border-gray-300 rounded"
        onChange={handleFileUpload}
      />
      <button 
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
        onClick={handleBase64ToPDF}
        disabled={!base64String}
      >
        Convert Base64 to PDF
      </button>

      {pdfUrl && (
        <div className="w-full max-w-lg mt-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Generated PDF:</h2>
          <iframe 
            src={pdfUrl} 
            className="w-full h-96 border border-gray-300 rounded"
            title="Generated PDF"
          />
        </div>
      )}

      <input 
        type="file" 
        accept="video/*" 
        className="mb-4 p-2 border border-gray-300 rounded"
        onChange={handleVideoUpload}
      />
      <button 
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
        onClick={handleBase64ToVideo}
        disabled={!videoBase64}
      >
        Convert Base64 to Video
      </button>

      {videoUrl && (
        <div className="w-full max-w-lg mt-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Generated Video:</h2>
          <video 
            src={videoUrl} 
            className="w-full h-96 border border-gray-300 rounded"
            controls
            title="Generated Video"
          />
        </div>
      )}
    </div>
  );
};

export default WorkCulture;
