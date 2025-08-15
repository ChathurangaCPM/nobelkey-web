import React from 'react';

interface RichContentProps {
  title?: string;
  content?: string;
  isAdmin?: boolean;
}

const RichContent: React.FC<RichContentProps> = ({ 
  title = "", 
  content = "",
  isAdmin = false 
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              {title}
            </h2>
          )}
          
          {content && (
            <div 
              className="rich-content max-w-none text-gray-700 leading-relaxed
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:leading-tight
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-5 [&_h2]:mt-7 [&_h2]:leading-tight
                [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-4 [&_h3]:mt-6 [&_h3]:leading-tight
                [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mb-3 [&_h4]:mt-5 [&_h4]:leading-tight
                [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:text-gray-900 [&_h5]:mb-3 [&_h5]:mt-4 [&_h5]:leading-tight
                [&_h6]:text-base [&_h6]:font-semibold [&_h6]:text-gray-900 [&_h6]:mb-2 [&_h6]:mt-4 [&_h6]:leading-tight
                [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:pl-4 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:pl-4 [&_ol]:space-y-2
                [&_li]:text-gray-700 [&_li]:leading-relaxed
                [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_a]:transition-colors [&_a]:duration-200
                [&_strong]:font-bold [&_strong]:text-gray-900
                [&_em]:italic
                [&_u]:underline
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:mb-4 [&_blockquote]:bg-gray-50 [&_blockquote]:italic [&_blockquote]:text-gray-600
                [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:mb-4 [&_pre]:overflow-x-auto
                [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md [&_img]:mb-4
                [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:mb-4
                [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-gray-100 [&_th]:font-semibold [&_th]:text-left
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2
                [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-8"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          
          {isAdmin && !content && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>Rich content will appear here. Add content using the rich text editor.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RichContent;
