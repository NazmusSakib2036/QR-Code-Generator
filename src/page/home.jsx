import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/home.css";

const Home = () => {
 const [image, setImage] = useState(null);
 const [qrCode, setQrCode] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [dragActive, setDragActive] = useState(false);
 const fileInputRef = useRef(null);

 const handleUpload = (file) => {
  if (file) {
   setIsLoading(true);
   // Simulate loading for better UX
   setTimeout(() => {
    const imgUrl = URL.createObjectURL(file);
    setImage(imgUrl);
    setQrCode(imgUrl);
    setIsLoading(false);
   }, 800);
  }
 };

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) handleUpload(file);
 };

 const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragenter" || e.type === "dragover") {
   setDragActive(true);
  } else if (e.type === "dragleave") {
   setDragActive(false);
  }
 };

 const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
   handleUpload(e.dataTransfer.files[0]);
  }
 };

 const downloadQR = () => {
  const canvas = document.getElementById("qr-gen");
  const pngUrl = canvas
   .toDataURL("image/png")
   .replace("image/png", "image/octet-stream");

  let link = document.createElement("a");
  link.href = pngUrl;
  link.download = "qrcode.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 };

 const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
   opacity: 1,
   transition: {
    staggerChildren: 0.2
   }
  }
 };

 const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
   opacity: 1,
   y: 0,
   transition: {
    duration: 0.6,
    ease: "easeOut"
   }
  }
 };

 const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
   opacity: 1,
   scale: 1,
   transition: {
    duration: 0.5,
    ease: "easeOut"
   }
  },
  hover: {
   scale: 1.03,
   y: -5,
   boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
   transition: {
    duration: 0.3,
    ease: "easeInOut"
   }
  }
 };

 return (
  <motion.div
   className="home-container"
   variants={containerVariants}
   initial="hidden"
   animate="visible"
  >
   <motion.h1
    className="title"
    variants={itemVariants}
   >
    <span className="title-accent">QR</span> Code Generator
    <motion.span
     className="title-sub"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ delay: 0.5, duration: 0.8 }}
    >
     Transform images into scannable QR codes instantly
    </motion.span>
   </motion.h1>

   <motion.div
    className="upload-section"
    variants={itemVariants}
   >
    <motion.div
     className={`upload-area ${dragActive ? "drag-active" : ""}`}
     onDragEnter={handleDrag}
     onDragLeave={handleDrag}
     onDragOver={handleDrag}
     onDrop={handleDrop}
     whileHover={{ scale: 1.02 }}
     whileTap={{ scale: 0.98 }}
     variants={cardVariants}
     initial="hidden"
     animate="visible"
     whileHover="hover"
    >
     <input
      type="file"
      accept="image/*"
      id="file-input"
      onChange={handleFileChange}
      ref={fileInputRef}
     />
     <div className="upload-content">
      <motion.div
       className="upload-icon"
       animate={{ y: [0, -5, 0] }}
       transition={{ repeat: Infinity, duration: 2 }}
      >
       📤
      </motion.div>
      <p className="upload-text">Drag & drop your image here</p>
      <p className="upload-subtext">or</p>
      <motion.label
       htmlFor="file-input"
       className="upload-button"
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >
       Browse Files
      </motion.label>
      <p className="upload-info">Supports: JPG, PNG, GIF (Max: 5MB)</p>
     </div>
    </motion.div>
   </motion.div>

   <AnimatePresence>
    {isLoading && (
     <motion.div
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
     >
      <motion.div
       className="loading-spinner"
       animate={{ rotate: 360 }}
       transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p>Generating your QR code...</p>
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {image && !isLoading && (
     <motion.div
      className="result-section"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
     >
      <motion.div
       className="result-container"
       variants={containerVariants}
       initial="hidden"
       animate="visible"
      >
       <motion.div
        className="preview-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
       >
        <h2>Uploaded Image</h2>
        <div className="image-container">
         <img src={image} alt="Uploaded Preview" />
        </div>
       </motion.div>

       <motion.div
        className="qr-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
       >
        <h2>Your QR Code</h2>
        <div className="qr-container">
         <QRCodeCanvas id="qr-gen" value={qrCode} size={200} />
        </div>
        <motion.button
         onClick={downloadQR}
         className="download-button"
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
        >
         <span>Download QR Code</span>
         <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
         >
          ⬇️
         </motion.span>
        </motion.button>
       </motion.div>
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>

   {/* The new footer section */}
   <div className="footer">
    <p>
     Design & Development by{" "}
     <a 
      href="https://www.fabtechit.com" 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ color: '#0dff00ff', textDecoration: 'none', fontWeight: 'bold' }}
     >
      FabTech.IT
     </a>
    </p>
   </div>
  </motion.div>
 );
};

export default Home;