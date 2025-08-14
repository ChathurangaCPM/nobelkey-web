interface GeneralContentProps {
    content?: string;
}

const GeneralContent: React.FC<GeneralContentProps> = ({
    content
}) => {
    const processContent = (content: string) => {
    return content.replace(/\n/g, '<br />');
};

    return (
        <div className="text-center py-14 pb-0 max-w-[800px] mx-auto mb-20">
            <p dangerouslySetInnerHTML={{ __html:  processContent(content || '') }}></p>
        </div>
    )
}

export default GeneralContent;