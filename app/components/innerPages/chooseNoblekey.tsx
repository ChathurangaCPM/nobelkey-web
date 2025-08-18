import Image from "next/image";

interface ChooseItemsProps {
    hoverIcon?: string;
    icon?: string;
    title?: string;
    description?: string;
}

interface ChooseNoblekeyProps {
    mainTitle?: string;
    tagline?: string;
    chooseItems?: ChooseItemsProps[]
}

const ChooseNoblekey: React.FC<ChooseNoblekeyProps> = ({
    mainTitle,
    tagline,
    chooseItems
}) => {
  

    const rowItems: ChooseItemsProps[] = typeof chooseItems === 'string' ? JSON.parse(chooseItems) : (chooseItems || []);

    return (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-10 mb-20">
            <div className="text-center flex flex-col gap-3 px-5 md:px-0">
                {mainTitle && <h2 className="font-extrabold text-4xl" dangerouslySetInnerHTML={{ __html: mainTitle }}></h2>}
                {tagline && <span className="font-bold">{tagline}</span>}
            </div>

            {rowItems && rowItems?.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-3 border-[1px] border-black/10 border-r-0 border-b-0">
                {rowItems?.map((d, i) => (
                    <div key={i} className="border-r-[1px] border-b-[1px] border-black/10 p-12 flex flex-col group gap-5 transition-all ease-in-out duration-150 hover:bg-[#3C51A3] hover:border-transparent hover:shadow-2xl hover:text-white">
                        <div className="mb-5">
                            <Image src={d?.icon || 'https://dummyimage.com/100x100/ddd/fff'} alt={d?.title || ''} width={80} height={80} className="group-hover:hidden" />
                            <Image src={d?.hoverIcon || 'https://dummyimage.com/100x100/000/fff'} alt={d?.title || ''} width={80} height={80} className="hidden group-hover:flex" />
                        </div>

                        <div className="w-full flex flex-col gap-5">
                            {d?.title && <h4 className="font-bold" dangerouslySetInnerHTML={{ __html: d.title || '' }}></h4>}

                            {d?.description && <p className="text-sm">{d?.description}</p>}
                        </div>
                    </div>
                ))}

            </div>}

        </div>
    )
}

export default ChooseNoblekey;