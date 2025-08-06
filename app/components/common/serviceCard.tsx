import Image from 'next/image';
import CustomReadMoreButton from './customReadMoreButton';
interface ServiceCardProps {
    data?: {
        imageUrl?: string,
        title?: string,
        description?: string,
        linkText?: string,
        url?: string
    }
}

const ServiceCard:React.FC<ServiceCardProps> = ({
    data
}) => {
    return (
        <div className="w-full bg-white shadow-lg rounded-md overflow-hidden hover:shadow-xl duration-300 hover:scale-105 transition-all ease-in-out">
            <Image src={data?.imageUrl || "/images/post-1.jpg"} alt="Service 1" width={600} height={300} className='w-full'/>

            <div className='text-black p-8 space-y-5'>
                <h3 className='font-semibold text-2xl'>{data?.title}</h3>
                <p className='text-muted-foreground'>{data?.description}</p>
                <CustomReadMoreButton text={data?.linkText || "Read more"} href={data?.url}/>
            </div>
        </div>
    )
}

export default ServiceCard;