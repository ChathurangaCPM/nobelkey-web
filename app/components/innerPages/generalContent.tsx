interface GeneralContentProps {
    content?: string;
}

const GeneralContent: React.FC<GeneralContentProps> = ({
    content
}) => {
    return (
        <div className="text-center">
            <p dangerouslySetInnerHTML={{ __html: content || '' }}></p>
        </div>
    )
}

export default GeneralContent;