interface GeneralContentProps {
    title?: string;
    content?: string;
}

const GeneralContent: React.FC<GeneralContentProps> = ({
    title,
    content
}) => {
    const processContent = (content: string) => {
        return content.replace(/\n/g, '<br />');
    };

    return (
        <div className="text-center py-14 pb-0 max-w-[800px] mx-auto mb-20">
            {title && <h2 className="font-extrabold text-4xl mb-5">{title}</h2>}
            <p dangerouslySetInnerHTML={{ __html: processContent(content || '') }}></p>
        </div>
    )
}

export default GeneralContent;