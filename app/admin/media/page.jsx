"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  FileImage,
  Upload,
  Plus,
  Copy,
  Trash2,
  Edit2,
  X,
  Search,
  Check,
  FolderPlus,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { getMedia, createMedia, renameMedia, deleteMedia } from "@/actions/media";
import { uploadFileToCloudinary } from "@/actions/upload";

export default function MediaLibraryPage() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("/");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals & UI States
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    const res = await getMedia({ folder: currentFolder, search });
    if (res.success) {
      setFiles(res.files);
      setFolders(res.folders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [currentFolder, search]);

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        
        // 1. Upload file to Cloudinary
        const result = await uploadFileToCloudinary(formData);
        if (result && result.url) {
          // 2. Save file info to MongoDB Media Collection
          await createMedia({
            name: file.name,
            url: result.url,
            publicId: result.url.split("/").pop().split(".")[0], // Approx fallback
            folder: currentFolder,
            size: file.size,
            type: file.type.startsWith("image") ? "image" : "pdf",
          });
        }
      }
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    let folderPath = newFolderName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!folderPath.startsWith("/")) {
      folderPath = `/${folderPath}`;
    }

    if (!folders.includes(folderPath)) {
      setFolders([...folders, folderPath]);
    }

    setNewFolderName("");
    setShowFolderModal(false);
    setCurrentFolder(folderPath);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!renameValue.trim() || !selectedFile) return;

    setActionLoading(true);
    const res = await renameMedia(selectedFile._id, renameValue);
    if (res.success) {
      setSelectedFile(res.media);
      setRenameValue("");
      fetchMedia();
    } else {
      alert(res.error || "Rename failed");
    }
    setActionLoading(false);
  };

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"? This will remove it from Vercel/Cloudinary storage permanently.`)) return;
    
    setActionLoading(true);
    const res = await deleteMedia(file._id);
    if (res.success) {
      setSelectedFile(null);
      fetchMedia();
    } else {
      alert(res.error || "Delete failed");
    }
    setActionLoading(false);
  };

  const handleCopyUrl = (file) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-brand-ivory uppercase tracking-wider">Media Library</h1>
          <p className="text-[10px] font-poppins text-brand-gray tracking-widest uppercase mt-1">Manage files, collections images and lookbook archives</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-brand-ivory border border-white/5 px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-brand-gold" /> New Folder
          </button>
          
          <button className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-colors relative overflow-hidden">
            <Upload className="w-4 h-4" /> Upload Files
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </button>
        </div>
      </div>

      {uploading && (
        <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-poppins font-medium uppercase tracking-wider rounded-lg flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          Syncing media files to Cloudinary...
        </div>
      )}

      {/* Filter and Path Bar */}
      <div className="bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
        {/* Path breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs font-poppins text-brand-gray">
          <button
            onClick={() => setCurrentFolder("/")}
            className={`hover:text-brand-ivory transition-colors ${currentFolder === "/" ? "text-brand-gold font-semibold" : ""}`}
          >
            Root
          </button>
          {currentFolder !== "/" && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-gold font-semibold uppercase tracking-wider">{currentFolder.substring(1)}</span>
            </>
          )}
        </div>

        <div className="flex items-center bg-[#161515] border border-white/5 rounded-lg px-3 py-2 w-full md:w-72">
          <Search className="w-4 h-4 text-brand-gray mr-2" />
          <input
            type="text"
            placeholder="Search media name globally..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-brand-ivory focus:outline-none w-full font-inter"
          />
        </div>
      </div>

      {/* Grid: Folders + Files */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Folders List sidebar */}
        <div className="xl:col-span-1 bg-[#0F0E0E]/80 border border-white/5 p-4 rounded-xl backdrop-blur-md space-y-3">
          <span className="block text-[9px] font-poppins text-brand-gray uppercase tracking-widest border-b border-white/5 pb-2">Atelier Folders</span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setCurrentFolder("/")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-poppins transition-colors text-left ${
                currentFolder === "/" ? "bg-brand-gold/10 text-brand-gold" : "text-brand-gray hover:text-brand-ivory hover:bg-white/5"
              }`}
            >
              <Folder className="w-4 h-4" /> Root (/)
            </button>
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setCurrentFolder(f)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-poppins transition-colors text-left uppercase tracking-wider ${
                  currentFolder === f ? "bg-brand-gold/10 text-brand-gold" : "text-brand-gray hover:text-brand-ivory hover:bg-white/5"
                }`}
              >
                <Folder className="w-4 h-4" /> {f.substring(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Files Grid panel */}
        <div className="xl:col-span-3">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0F0E0E]/80 border border-white/5 rounded-xl">
              <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="font-poppins text-xs text-brand-gray uppercase tracking-widest">Querying Media assets...</p>
            </div>
          ) : files.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file._id}
                  onClick={() => { setSelectedFile(file); setRenameValue(""); }}
                  className={`bg-[#0F0E0E]/80 border rounded-xl overflow-hidden cursor-pointer group hover:border-brand-gold/30 transition-all select-none relative ${
                    selectedFile?._id === file._id ? "border-brand-gold" : "border-white/5"
                  }`}
                >
                  <div className="aspect-square bg-[#161515] relative overflow-hidden flex items-center justify-center">
                    {file.type === "image" ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <FileImage className="w-10 h-10 text-brand-gray" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-inter text-brand-ivory truncate font-medium">{file.name}</p>
                    <span className="text-[8px] font-poppins text-brand-gray block mt-0.5">{formatBytes(file.size)}</span>
                  </div>
                  
                  {/* Quick Copy Action Overlay button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(file);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-brand-ivory rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === file._id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center font-poppins text-xs text-brand-gray uppercase tracking-widest bg-[#0F0E0E]/80 border border-white/5 rounded-xl border-dashed">
              This folder is currently empty. Upload files to add lookbook assets.
            </div>
          )}
        </div>
      </div>

      {/* Inspector Modal Overlay */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedFile(null)}></div>
          
          <div className="w-full max-w-lg bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-scaleIn flex flex-col">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-poppins text-brand-gray uppercase tracking-widest">Asset Details</span>
              <button onClick={() => setSelectedFile(null)} className="text-brand-gray hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Preview Box */}
              <div className="aspect-video bg-[#161515] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center relative">
                {selectedFile.type === "image" ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="w-full h-full object-contain" />
                ) : (
                  <FileImage className="w-16 h-16 text-brand-gray" />
                )}
                <a href={selectedFile.url} target="_blank" className="absolute bottom-3 right-3 p-1.5 bg-black/60 hover:bg-black rounded-full text-brand-ivory">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Stats Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs font-inter text-brand-gray">
                <div>
                  <span className="block text-[8px] font-poppins text-brand-gray uppercase tracking-wider">File Name</span>
                  <span className="text-brand-ivory block mt-0.5 break-all">{selectedFile.name}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-poppins text-brand-gray uppercase tracking-wider">File Size</span>
                  <span className="text-brand-ivory block mt-0.5">{formatBytes(selectedFile.size)}</span>
                </div>
              </div>

              {/* Rename Form */}
              <form onSubmit={handleRename} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New file name..."
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="flex-1 bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins px-4 rounded font-semibold uppercase tracking-wider"
                >
                  Rename
                </button>
              </form>

              {/* Actions Footer */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedFile)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-brand-ivory border border-white/5 py-2.5 rounded text-xs font-poppins uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  {copiedId === selectedFile._id ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy CDN URL
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedFile)}
                  disabled={actionLoading}
                  className="px-6 bg-red-950/20 hover:bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 rounded text-xs font-poppins uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Delete Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFolderModal(false)}></div>
          
          <div className="w-full max-w-sm bg-[#0F0E0E] border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-scaleIn">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-poppins text-brand-ivory font-semibold uppercase tracking-wider">Create Media Folder</span>
              <button onClick={() => setShowFolderModal(false)} className="text-brand-gray hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Folder Name (e.g. Products 2026)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-[#161515] border border-white/5 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-poppins py-2.5 rounded font-semibold uppercase tracking-widest"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-brand-ivory py-2.5 rounded text-xs font-poppins uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
