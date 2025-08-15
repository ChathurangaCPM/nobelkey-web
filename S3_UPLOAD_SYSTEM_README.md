# AWS S3 File Upload System

This document describes the new AWS S3-based file upload system that replaces the previous local file storage system.

## Overview

The system has been upgraded to:
- Store files in AWS S3 instead of local storage
- Support both images and documents
- Provide image optimization for better performance
- Maintain backward compatibility with existing components

## Features

### ✅ What's New
- **AWS S3 Integration**: All files are now stored in AWS S3 bucket
- **Document Support**: Upload PDFs, Word docs, Excel files, PowerPoint, text files, CSVs, and ZIP files
- **Image Optimization**: Automatic compression and resizing for images
- **File Type Detection**: Automatic categorization of files as images or documents
- **Enhanced Security**: Files are organized by user ID and date
- **Better File Management**: Delete files from both database and S3
- **Comprehensive UI**: New media library interface with statistics and management tools

### 📁 Supported File Types

**Images (max 5MB each):**
- JPEG, JPG, PNG, GIF, WebP, SVG

**Documents (max 10MB each):**
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP

## Components

### 1. Core Components

#### `FileSelector` - Universal File Selector
```tsx
import FileSelector from "@/app/components/admin/fileSelector";

<FileSelector
  value={selectedFile}
  onChange={(files) => setSelectedFile(files[0]?.url || '')}
  removeFile={() => setSelectedFile('')}
  acceptedTypes="all" // 'images' | 'documents' | 'all'
  title="Select a file"
  description="Select a file from the media library"
/>
```

#### `ImageSelector` - Image-Only Selector (Backward Compatible)
```tsx
import ImageSelector from "@/app/components/admin/imageSelector";

<ImageSelector
  value={selectedImage}
  onChange={(files) => setSelectedImage(files[0]?.url || '')}
  removeImage={() => setSelectedImage('')}
/>
```

#### `DocumentSelector` - Document-Only Selector
```tsx
import DocumentSelector from "@/app/components/admin/documentSelector";

<DocumentSelector
  value={selectedDocument}
  onChange={(files) => setSelectedDocument(files[0]?.url || '')}
  removeDocument={() => setSelectedDocument('')}
/>
```

#### `UploadFiles` - Universal Upload Component
```tsx
import UploadFiles from "@/app/components/admin/common/uploadFiles";

<UploadFiles
  acceptedTypes="all" // 'images' | 'documents' | 'all'
  maxFiles={10}
  onUpload={(files) => console.log('Uploaded:', files)}
/>
```

### 2. Legacy Components (Still Work)

#### `UploadImages` - Image Upload (Updated to use new system)
```tsx
import UploadImages from "@/app/components/admin/common/uploadImage";

<UploadImages onUpload={(files) => console.log('Uploaded:', files)} />
```

## API Endpoints

### Upload Files
```
POST /api/admin/upload
```
- Accepts FormData with 'files' field
- Supports both images and documents
- Returns file information including S3 URLs

### Get Media Library
```
GET /api/admin/media
```
- Returns all files for the authenticated user
- Includes file metadata and S3 information

### Delete File
```
DELETE /api/admin/media/delete?id={fileId}
```
- Deletes file from both database and S3
- Requires file ownership verification

## Database Schema

The `MediaLibrary` model has been enhanced with new fields:

```typescript
interface IMediaLibrary {
  userId: ObjectId;
  type?: string;
  title?: string;
  alt?: string;
  description?: string;
  url: string;
  s3Key?: string;           // NEW: S3 object key
  s3Bucket?: string;        // NEW: S3 bucket name
  fileSize?: number;        // NEW: File size in bytes
  originalSize?: number;    // NEW: Original size before optimization
  optimizedSize?: number;   // NEW: Size after optimization
  compressionRatio?: string; // NEW: Compression percentage
  fileCategory?: 'images' | 'documents'; // NEW: File category
  mimeType?: string;        // NEW: MIME type
  access?: any[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables

Make sure these are set in your `.env` file:

```env
# AWS S3 Configuration
S3_BUCKET_NAME=your-bucket-name
S3_REGION=your-region
S3_ACCESS_KEY=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

## Next.js Configuration

Add your S3 bucket hostname to `next.config.js` to allow Next.js Image component to load S3 images:

```javascript
module.exports = {
    images: {
        remotePatterns: [
            // ... other patterns
            {
                protocol: 'https',
                hostname: '*.s3.*.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'your-bucket-name.s3.your-region.amazonaws.com',
            }
        ],
    },
    // ... rest of config
};
```

## File Organization in S3

Files are organized in S3 with the following structure:
```
bucket/
├── images/
│   └── YYYY/
│       └── MM/
│           └── DD/
│               └── userId/
│                   └── timestamp-random.ext
└── documents/
    └── YYYY/
        └── MM/
            └── DD/
                └── userId/
                    └── timestamp-random.ext
```

## Usage Examples

### Basic Image Upload
```tsx
const [selectedImage, setSelectedImage] = useState('');

<ImageSelector
  value={selectedImage}
  onChange={(files) => setSelectedImage(files[0]?.url || '')}
  removeImage={() => setSelectedImage('')}
/>
```

### Document Upload with Custom Handler
```tsx
const [documents, setDocuments] = useState([]);

<UploadFiles
  acceptedTypes="documents"
  maxFiles={5}
  onUpload={(files) => {
    setDocuments(prev => [...prev, ...files]);
    console.log('Uploaded documents:', files);
  }}
/>
```

### Mixed File Upload
```tsx
<UploadFiles
  acceptedTypes="all"
  maxFiles={10}
  onUpload={(files) => {
    const images = files.filter(f => f.fileCategory === 'images');
    const docs = files.filter(f => f.fileCategory === 'documents');
    console.log('Images:', images);
    console.log('Documents:', docs);
  }}
/>
```

## Media Library Demo

Visit `/admin/media-library` to see a comprehensive demo of all features:
- File library with filtering
- Upload interface for different file types
- Component selectors demonstration
- Storage statistics and information

## Migration Notes

### Backward Compatibility
- All existing `ImageSelector` components continue to work
- Existing `UploadImages` components are automatically updated
- Old file URLs remain accessible during transition

### New Features Available
- Use `FileSelector` for universal file selection
- Use `DocumentSelector` for document-only selection
- Use `UploadFiles` for enhanced upload experience

## Security Features

1. **User Isolation**: Files are organized by user ID
2. **File Type Validation**: Server-side validation of file types
3. **Size Limits**: Different limits for images (5MB) and documents (10MB)
4. **S3 Security**: Files stored with proper access controls
5. **Authentication**: All operations require valid user session

## Performance Optimizations

1. **Image Compression**: Automatic JPEG/PNG optimization
2. **Lazy Loading**: Components load files on demand
3. **Efficient Storage**: S3 provides global CDN capabilities
4. **Metadata Caching**: File information cached in database

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check AWS credentials and bucket permissions
2. **Files Not Loading**: Verify S3 bucket public read access
3. **Large Files**: Ensure files are within size limits
4. **Type Errors**: Check file MIME types against supported formats
5. **ACL Permission Error**: If you get `s3:PutObjectAcl` errors, ensure your S3 bucket is configured for public read access at the bucket level instead of using object-level ACLs

### S3 Bucket Configuration

Since the system doesn't use object-level ACLs, you need to configure your S3 bucket for public read access:

1. **Bucket Policy** (Recommended):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

2. **Block Public Access Settings**:
   - Uncheck "Block all public access" or specifically allow "Block public access to buckets and objects granted through new public bucket or access point policies"

3. **IAM User Permissions**:
Your IAM user needs these permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### Debug Information

Enable debug logging by checking the browser console and server logs for detailed error messages.

## Future Enhancements

Potential improvements for future versions:
- Image resizing variants (thumbnails, medium, large)
- Video file support
- Bulk file operations
- Advanced file search and filtering
- File versioning
- CDN integration for better performance
