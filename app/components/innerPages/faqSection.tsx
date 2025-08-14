import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqItemsProps {
    title?: string;
    description?: string;
}

interface FaqSectionProps {
    mainTitle?: string;
    faqItems?: FaqItemsProps[];
}

const FaqSection: React.FC<FaqSectionProps> = ({
    mainTitle,
    faqItems
}) => {

    const processContent = (content: string) => {
        return content.replace(/\n/g, '<br />');
    };
    const rowItems: FaqItemsProps[] = typeof faqItems === 'string' ? JSON.parse(faqItems) : (faqItems || []);

    return (
        <div className="mb-20">
            {mainTitle && <div className="text-center flex flex-col gap-3 mb-10">
                <h2 className="font-extrabold text-4xl">{mainTitle}</h2>
            </div>}


            {rowItems && rowItems?.length > 0 && <Accordion
                type="single"
                collapsible
                className="max-w-[800px] mx-auto"
                defaultValue="item-0"
            >
                {rowItems?.map((d, i) => (
                    <AccordionItem value={`item-${i}`} key={i} className="data-[state=open]:border-b-4 data-[state=open]:border-[#3C51A3]">
                        <AccordionTrigger className="font-extrabold text-[16px]">{d?.title}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 ">
                            <p dangerouslySetInnerHTML={{ __html: processContent(d?.description || '') }}></p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                
            </Accordion>}
        </div>
    )
}

export default FaqSection;