import React, { useState, useRef, useEffect } from 'react';
import { 
  uploadDocument, 
  getDocuments, 
  deleteDocument,
  formatFileSize,
  isValidDocumentType,
  type DocumentDto 
} from '../services/documentService';
import AlertModal from '../components/AlertModal';

interface DocsTabProps {
  projectId: number;
}

const DocsTab: React.FC<DocsTabProps> = ({ projectId }) => {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: number; title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments(projectId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!isValidDocumentType(file)) {
      setError('Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    // Validate file size (max 200MB)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      setError('File size exceeds 200MB limit');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Simulate upload progress (in real implementation, this would come from the upload handler)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const document = await uploadDocument(projectId, file, {
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for title
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reload documents list
      await loadDocuments();

      // Show success message
      setSuccessMessage(`Document "${document.title}" uploaded successfully!`);

      // Reset after a short delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error uploading document:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload document');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDeleteClick = (documentId: number, documentTitle: string) => {
    setDocumentToDelete({ id: documentId, title: documentTitle });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocument(documentToDelete.id);
      await loadDocuments();
      setSuccessMessage(`Document "${documentToDelete.title}" deleted successfully!`);
      setShowDeleteConfirm(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete document');
      setShowDeleteConfirm(false);
      setDocumentToDelete(null);
    }
  };

  const handleViewText = (doc: DocumentDto) => {
    setSelectedText(doc.extracted_text || 'No text extracted yet.');
    setSelectedDocTitle(doc.title || doc.file_name);
    setShowTextModal(true);
  };

  const getFileIcon = (mimeType: string | null, fileName: string) => {
    if (mimeType?.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      return 'picture_as_pdf';
    }
    if (mimeType?.includes('word') || fileName.toLowerCase().match(/\.(doc|docx)$/)) {
      return 'description';
    }
    return 'insert_drive_file';
  };

  const getFileTypeColor = (mimeType: string | null, fileName: string) => {
    if (mimeType?.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      return '#DC2626'; // Red for PDF
    }
    if (mimeType?.includes('word') || fileName.toLowerCase().match(/\.(doc|docx)$/)) {
      return '#2563EB'; // Blue for Word
    }
    return '#64748B'; // Gray for others
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0" style={{ fontSize: '20px', color: '#0F172A' }}>Documents</h3>
      </div>

      {/* Error Modal */}
      <AlertModal
        open={error !== null}
        variant="error"
        title="Error"
        message={error || ''}
        onClose={() => setError(null)}
        confirmText="OK"
      />

      {/* Success Modal */}
      <AlertModal
        open={successMessage !== null}
        variant="success"
        title="Success"
        message={successMessage || ''}
        onClose={() => setSuccessMessage(null)}
        confirmText="OK"
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        open={showDeleteConfirm}
        variant="warning"
        title="Delete Document"
        message={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
      />

      {/* Extracted Text Modal */}
      {showTextModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} 
          onClick={() => setShowTextModal(false)}
        >
          <div 
            className="bg-white rounded-3 shadow-lg border w-100" 
            style={{ maxWidth: '800px', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 fw-bold" style={{ fontSize: '20px', color: '#0F172A' }}>
                  Extracted Text - {selectedDocTitle}
                </h3>
                <button
                  className="btn btn-link p-0"
                  onClick={() => setShowTextModal(false)}
                  style={{ width: '32px', height: '32px', fontSize: '24px', color: '#64748B' }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4" style={{ maxHeight: 'calc(90vh - 120px)', overflow: 'auto' }}>
              {selectedText ? (
                <div 
                  style={{ 
                    fontSize: '14px', 
                    color: '#334155', 
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {selectedText}
                </div>
              ) : (
                <div className="text-center py-5">
                  <span className="material-icons" style={{ fontSize: '48px', color: '#CBD5E1' }}>
                    text_fields
                  </span>
                  <p className="text-secondary mt-3">No text extracted yet</p>
                </div>
              )}
            </div>
            <div className="p-4 border-top d-flex justify-content-end">
              <button 
                className="btn btn-dark rounded" 
                onClick={() => setShowTextModal(false)}
                style={{ height: '40px', padding: '0 20px', fontSize: '14px', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border rounded-3 p-5 mb-4 text-center ${
          dragActive ? 'border-primary bg-light' : 'border-2'
        }`}
        style={{
          borderStyle: dragActive ? 'dashed' : 'dashed',
          borderWidth: '2px',
          backgroundColor: dragActive ? '#EFF6FF' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.6 : 1,
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {uploading ? (
          <div>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="mb-2" style={{ fontSize: '14px', color: '#64748B' }}>
              Uploading document... {uploadProgress}%
            </p>
            <div className="progress" style={{ maxWidth: '300px', margin: '0 auto' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        ) : (
          <div>
            <span
              className="material-icons"
              style={{ fontSize: '48px', color: '#64748B', marginBottom: '12px' }}
            >
              cloud_upload
            </span>
            <p className="mb-2" style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>
              Drag and drop your document here, or click to browse
            </p>
            <p className="mb-0" style={{ fontSize: '13px', color: '#64748B' }}>
              Supported formats: PDF, Word (.doc, .docx) • Max size: 200MB
            </p>
          </div>
        )}
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-5">
          <span
            className="material-icons"
            style={{ fontSize: '64px', color: '#CBD5E1', marginBottom: '16px' }}
          >
            description
          </span>
          <p className="text-secondary mb-0">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="row g-3">
          {documents.map((doc) => (
            <div key={doc.id} className="col-md-6">
              <div className="bg-white rounded-3 p-4 border shadow-sm h-100">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: getFileTypeColor(doc.mime_type, doc.file_name) + '15',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-icons"
                      style={{
                        fontSize: '24px',
                        color: getFileTypeColor(doc.mime_type, doc.file_name),
                      }}
                    >
                      {getFileIcon(doc.mime_type, doc.file_name)}
                    </span>
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <h6
                      className="mb-1 fw-semibold text-truncate"
                      style={{ fontSize: '14px', color: '#0F172A' }}
                      title={doc.title || doc.file_name}
                    >
                      {doc.title || doc.file_name}
                    </h6>
                    <p className="mb-2" style={{ fontSize: '12px', color: '#64748B' }}>
                      {formatFileSize(doc.file_size)} • {doc.file_name.split('.').pop()?.toUpperCase()}
                    </p>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      {doc.is_processed ? (
                        <span
                          className="badge rounded-pill px-2 py-1"
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#ECFDF5',
                            color: '#10B981',
                            fontWeight: 500,
                          }}
                        >
                          Processed
                        </span>
                      ) : (
                        <span
                          className="badge rounded-pill px-2 py-1"
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#FEF3C7',
                            color: '#D97706',
                            fontWeight: 500,
                          }}
                        >
                          Processing...
                        </span>
                      )}
                      {doc.extracted_text && (
                        <span
                          className="badge rounded-pill px-2 py-1"
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#E0E7FF',
                            color: '#6366F1',
                            fontWeight: 500,
                          }}
                        >
                          Text Extracted
                        </span>
                      )}
                      {doc.uploaded_by_name && (
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          by {doc.uploaded_by_name}
                        </span>
                      )}
                    </div>
                    <div className="mt-2" style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {doc.extracted_text && (
                      <button
                        className="btn btn-sm btn-link p-1"
                        style={{ color: '#6366F1' }}
                        title="View Extracted Text"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewText(doc);
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: '18px' }}>
                          text_fields
                        </span>
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-link p-1"
                      style={{ color: '#64748B' }}
                      title="Download"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement download
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>
                        download
                      </span>
                    </button>
                    <button
                      className="btn btn-sm btn-link p-1"
                      style={{ color: '#EF4444' }}
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(doc.id, doc.title || doc.file_name);
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocsTab;
