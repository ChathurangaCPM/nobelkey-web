import FileSelector from "./fileSelector";

interface DocumentType {
    _id: string;
    path?: any;
    url: string;
    alt: string;
    title: string;
    fileCategory: 'documents';
    mimeType: string;
    fileSize?: number;
}

interface DocumentSelectorProps {
    value: string;
    onChange: (files: DocumentType[]) => void;
    removeDocument: (value: boolean) => void;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
    value,
    onChange,
    removeDocument
}) => {
    const handleFileChange = (files: any[]) => {
        // Convert FileType to DocumentType
        const documentFiles = files.map(file => ({
            _id: file._id,
            path: file.url || file.path,
            url: file.url,
            alt: file.alt,
            title: file.title,
            fileCategory: 'documents' as const,
            mimeType: file.mimeType,
            fileSize: file.fileSize
        }));
        onChange(documentFiles);
    };

    return (
        <FileSelector
            value={value}
            onChange={handleFileChange}
            removeFile={removeDocument}
            acceptedTypes="documents"
            title="Select a document"
            description="Select a document from the media library"
        />
    );
};

export default DocumentSelector;
