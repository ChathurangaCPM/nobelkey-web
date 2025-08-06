import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
    image: string;
    date?: string;
    title: string;
    description: string;
    link?: string;
    linkText?: string;
    className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    date,
    title,
    description,
    link,
    linkText,
}) => {
    return (
        <div className="bg-white rounded-md overflow-hidden shadow-md">
            <Image
                src={image}
                alt={`${title} blog`}
                className="w-full object-cover relative "
                width={400}
                height={200}
            />
            <div className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-yellow-500" />
                    <span className="text-xs font-semibold">{date}</span>
                </div>
                <Link href={link || '#'} className="text-2xl font-semibold hover:underline hover:underline-offset-4 transition-all ease-in-out delay-75 cursor-pointer block">{title}</Link>
                <p className="text-gray-600 text-sm">{description}</p>
                <Link href={link || '#'} className="font-semibold flex items-center gap-2 hover:text-yellow-500 transition-colors ease-in-out delay-75">
                    <span className="block w-10 h-1 bg-yellow-500"></span>
                    {linkText}
                </Link>
            </div>
        </div>
    )
}

export default BlogCard;