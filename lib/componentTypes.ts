type ServiceType = {
    title?: string;
    description?: string;
    icon?: string;
};

type TestimonialType = {
    name?: string;
    comment?: string;
    rating?: number;
    image?: string;
};

type TestimonialRightType = {
    title?: string;
    description?: string;
    icon?: string;
};

// Define a union type for all possible default values
type DefaultValueType = string | number | ServiceType[] | TestimonialType[] | TestimonialRightType[];

export interface ComponentProp {
    name: string;
    type: "text" |
    "textarea" |
    "select" |
    "email" |
    "color" |
    "number" |
    "mainImage" |
    "image" |
    "welcomeSection" |
    "numberResults" |
    "featuredServices" |
    "recentProjects" |
    "ourBrandRow" |
    "serviceRepeater" |
    "sliderItems" |
    "chooseItems" |
    "faqItems" |
    "solutionCardsRepeater" |
    "projectsRepeater" |
    "linksRepeater" |
    "serviceItems" |
    "blogItems" |
    "numberItems" |
    "testimonials" |
    "groupTitle" |
    "getQuote" |
    "testimonialsRightRepeater";
    options?: string[];
    displayName?: string;
    defaultValue: DefaultValueType;
}

// Define a more specific type for component props
type ComponentPropsType = string | undefined | ServiceType[] | TestimonialType[] | TestimonialRightType[];

export interface ComponentType {
    name: string;
    category: "basic" | "custom" | "home";
    defaultProps: Record<string, ComponentPropsType>;
    customName: string;
    propDefinitions?: ComponentProp[];
}

export interface Component {
    id: string;
    type: string;
    customName: string;
    props: Record<string, ComponentPropsType>;
}

export const COMPONENT_TYPES: ComponentType[] = [
    // {
    //     name: "Button",
    //     category: "basic",
    //     defaultProps: {
    //         text: "Button Text",
    //         variant: "default",
    //     }
    // },
    // {
    //     name: "Heading",
    //     category: "basic",
    //     defaultProps: {
    //         text: "Heading Text",
    //         size: "h2",
    //     }
    // },
    // {
    //     name: "Paragraph",
    //     category: "basic",
    //     defaultProps: {
    //         text: "Paragraph content",
    //     }
    // },
    {
        name: "Main Banner",
        category: "home",
        customName: "mainBanner",
        defaultProps: {
            backgroundImageUrl: "",
            leftText: "",
            scrollText: "Scroll to Explore",
            sliderItems: []
        },
        propDefinitions: [
            {
                name: "backgroundImageUrl",
                type: "image",
                displayName: "Select Main Background Image",
                defaultValue: "",
            },
            {
                name: "sliderItems",
                type: "sliderItems",
                displayName: "Select Slider Image",
                defaultValue: [],
            },
            {
                name: "backgroundImageUrl",
                type: "image",
                displayName: "Select Main Background Image",
                defaultValue: ""
            },
            {
                name: "scrollText",
                type: "text",
                displayName: "Scroll Text",
                defaultValue: ""
            },
            {
                name: "leftText",
                type: "text",
                displayName: "Left Text",
                defaultValue: ""
            },
        ]
    },
    {
        name: "Welcome Section",
        category: "home",
        customName: "welcomeSection",
        defaultProps: {
            topTagline: "",
            title: "",
            description: "",
            link: "",
            imageUrl: "",
            secondImageUrl: "",

            content: "",
            bottomTagline: "",
        },
        propDefinitions: [
            {
                name: "topTagline",
                displayName: "Top tagline",
                type: "text",
                defaultValue: ""
            },
            {
                name: "title",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "description",
                displayName: "Description",
                type: "textarea",
                defaultValue: ""
            },
            {
                name: "link",
                displayName: "Link",
                type: "text",
                defaultValue: ""
            },
            {
                name: "imageUrl",
                displayName: "Select First Image",
                type: "image",
                defaultValue: ""
            },
            {
                name: "secondImageUrl",
                displayName: "Select Second Image",
                type: "image",
                defaultValue: ""
            },

            {
                name: "content",
                displayName: "Right Content",
                type: "textarea",
                defaultValue: ""
            },

            {
                name: "bottomTagline",
                displayName: "Bottom Tagline",
                type: "text",
                defaultValue: ""
            },
        ]
    },
    {
        name: "Number Results",
        category: "home",
        customName: "numberResults",
        defaultProps: {
            mainTitle: "",
            description: "",
            middleImage: "",
            items: [],
        },
        propDefinitions: [
            {
                name: "mainTitle",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "description",
                displayName: "Description",
                type: "text",
                defaultValue: ""
            },
            {
                name: "middleImage",
                displayName: "Middle Image",
                type: "image",
                defaultValue: ""
            },
            {
                name: "items",
                displayName: "Items",
                type: "numberItems",
                defaultValue: []
            },
        ]
    },
    {
        name: "Featured Services",
        category: "home",
        customName: "featuredServices",

        defaultProps: {
            mainTitle: "",
            description: "",
            link: "",
            serviceItems: [],
        },

        propDefinitions: [
            {
                name: "mainTitle",
                displayName: "Main title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "description",
                displayName: "Descriptions",
                type: "textarea",
                defaultValue: ""
            },
            {
                name: "link",
                displayName: "Link",
                type: "text",
                defaultValue: ""
            },
            {
                name: "serviceItems",
                displayName: "Servers",
                type: "serviceItems",
                defaultValue: []
            },
        ]
    },
    {
        name: "Recent Projects",
        category: "home",
        customName: "recentProjects",
        defaultProps: {
            mainTitle: "",
            description: "",
            link: "",
            linkText: "",
            projects: []
        },
        propDefinitions: [
            {
                name: "mainTitle",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "description",
                displayName: "Description",
                type: "textarea",
                defaultValue: ""
            },
            {
                name: "link",
                displayName: "Link (URL)",
                type: "text",
                defaultValue: ""
            },
            {
                name: "linkText",
                displayName: "Link Text",
                type: "text",
                defaultValue: ""
            },

            {
                name: "projects",
                displayName: "Projects",
                type: "projectsRepeater",
                defaultValue: []
            },
        ]
    },
    {
        name: "Our Brand Row",
        category: "home",
        customName: "ourBrandRow",
        defaultProps: {
            title: "",
            description: "",
            linkCards: []
        },
        propDefinitions: [
            {
                name: "title",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "description",
                displayName: "Description",
                type: "textarea",
                defaultValue: ""
            },
            {
                name: "linkCards",
                displayName: "Link Cards",
                type: "linksRepeater",
                defaultValue: []
            },
        ]
    },
    {
        name: "What We Offer",
        category: "home",
        customName: "whatWeOffer",
        defaultProps: {
            backgroundImage: "",
            topTagline: "",
            title: "",
            description: "",
            services: []
        },
        propDefinitions: [
            {
                name: "backgroundImage",
                displayName: "Select a Background Image",
                type: "image",
                defaultValue: ""
            },
            {
                name: "topTagline",
                displayName: "Top tagline",
                type: "text",
                defaultValue: ""
            },
            {
                name: "title",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "description",
                displayName: "Description",
                type: "textarea",
                defaultValue: ""
            },
            {
                name: "services",
                displayName: "Services",
                type: "serviceRepeater",
                defaultValue: []
            },
        ]
    },
    {
        name: "Blog Section",
        category: "home",
        customName: "blogSection",
        defaultProps: {
            mainTitle: "",
            link: "",
            linkText: "",
            blogItems: [],
        },
        propDefinitions: [
            {
                name: "mainTitle",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "link",
                displayName: "Link",
                type: "text",
                defaultValue: ""
            },
            {
                name: "linkText",
                displayName: "Link text",
                type: "text",
                defaultValue: ""
            },
            {
                name: "blogItems",
                displayName: "Add blog items",
                type: "blogItems",
                defaultValue: []
            },
        ]
    },
    {
        name: "Get Quote",
        category: "home",
        customName: "getQuote",
        defaultProps: {
            leftMainTitle: "",
            leftTagline: "",
            leftSmallText: "",
            leftLink: "",
            leftLinkText: "",

            groupTitle: "",

            rightTitle: "",
            rightDescription: "",
            formEmailAddress: ""
        },
        propDefinitions: [
            {
                name: "leftMainTitle",
                displayName: "Left Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "leftTagline",
                displayName: "Left Tagline",
                type: "text",
                defaultValue: ""
            },
            {
                name: "leftSmallText",
                displayName: "Left Small Text",
                type: "text",
                defaultValue: ""
            },
            {
                name: "leftLink",
                displayName: "Left Link",
                type: "text",
                defaultValue: ""
            },
            {
                name: "leftLinkText",
                displayName: "Left Link Text",
                type: "text",
                defaultValue: ""
            },
            {
                name: "groupTitle",
                displayName: "Right Card Data",
                type: "groupTitle",
                defaultValue: ""
            },
            {
                name: "rightTitle",
                displayName: "Right Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "rightDescription",
                displayName: "Right Description",
                type: "textarea",
                defaultValue: ""
            },
            {
                name: "formEmailAddress",
                displayName: "To Email Address",
                type: "email",
                defaultValue: ""
            },
        ]
    },
    {
        name: "Banner",
        category: "basic",
        customName: "innerBanner",
        defaultProps: {
            backgroundImage: "",
            mainTitle: "",
            subLine: "",
        },
        propDefinitions: [
            {
                name: "backgroundImage",
                displayName: "Header Background Image",
                type: "image",
                defaultValue: ""
            },
            {
                name: "mainTitle",
                displayName: "Page Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "subLine",
                displayName: "Sub Text Line",
                type: "text",
                defaultValue: ""
            },
        ]
    },
    {
        name: "General Content",
        category: "basic",
        customName: "generalContent",
        defaultProps: {
            content: "",
        },
        propDefinitions: [
            {
                name: "content",
                displayName: "Add a general content",
                type: "textarea",
                defaultValue: ""
            },
        ]
    },
    {
        name: "Choose Nobelkey",
        category: "basic",
        customName: "chooseNobelkey",
        defaultProps: {
            mainTitle: "",
            tagline: "",
            chooseItems: []
        },
        propDefinitions: [
            {
                name: "mainTitle",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "tagline",
                displayName: "Tagline",
                type: "text",
                defaultValue: ""
            },
            {
                name: "chooseItems",
                displayName: "Add a items",
                type: "chooseItems",
                defaultValue: []
            },
        ]
    },
    {
        name: "FAQ",
        category: "basic",
        customName: "faqSection",
        defaultProps: {
            mainTitle: "",
            faqItems: []
        },
        propDefinitions: [
            {
                name: "mainTitle",
                displayName: "Main Title",
                type: "text",
                defaultValue: ""
            },
            {
                name: "faqItems",
                displayName: "Add a items",
                type: "faqItems",
                defaultValue: []
            },
        ]
    },
    {
        name: "Solution Cards",
        category: "basic",
        customName: "solutionsCards",
        defaultProps: {
            solutionCardsRepeater: []
        },
        propDefinitions: [
            {
                name: "solutionCardsRepeater",
                displayName: "Add a Card",
                type: "solutionCardsRepeater",
                defaultValue: []
            },
        ]
    },
    // {
    //     name: "Book Your Ride",
    //     category: "home",
    //     customName: "bookYourRide",
    //     defaultProps: {
    //         leftImage: "",
    //         topTagline: "",
    //         title: "",
    //     },
    //     propDefinitions: [
    //         {
    //             name: "leftImage",
    //             displayName: "Select a Image",
    //             type: "image",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "topTagline",
    //             displayName: "Top tagline",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "title",
    //             displayName: "Main Title",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //     ]
    // },
    // {
    //     name: "Choose Your Ride",
    //     category: "home",
    //     customName: "chooseYourRide",
    //     defaultProps: {
    //         topTagline: "",
    //         title: "",
    //         descriptions: ""
    //     },
    //     propDefinitions: [
    //         {
    //             name: "topTagline",
    //             displayName: "Top tagline",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "title",
    //             displayName: "Main Title",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "descriptions",
    //             displayName: "Description",
    //             type: "textarea",
    //             defaultValue: ""
    //         },
    //     ]
    // },
    // {
    //     name: "Testimonials",
    //     category: "home",
    //     customName: "testimonials",
    //     defaultProps: {
    //         leftTopTagline: "Customer reviews",
    //         leftTitle: "What our customers say",
    //         leftDescriptions: "We provide the best service in the city. The city that you can trust and feel comfortable with. We have the best drivers who take care of your journey.",
    //         testimonials: [],

    //         groupTitle: "",

    //         rightTopTagline: "Why Choose Us",
    //         rightTitle: "Why Ride with CityCabs?",
    //         rightDescriptions: "We provide the best service in the city. The city that you can trust and feel comfortable with. We have the best drivers who take care of your journey.",
    //         testimonialsRightRepeater: [],
    //     },
    //     propDefinitions: [
    //         {
    //             name: "leftTopTagline",
    //             displayName: "Left Top tagline",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "leftTitle",
    //             displayName: "Left Main Title",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "leftDescriptions",
    //             displayName: "Left Description",
    //             type: "textarea",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "testimonials",
    //             displayName: "Testimonials",
    //             type: "testimonials",
    //             defaultValue: []
    //         },
    //         {
    //             name: "groupTitle",
    //             displayName: "Right Col data",
    //             type: "groupTitle",
    //             defaultValue: ""
    //         },

    //         {
    //             name: "rightTopTagline",
    //             displayName: "Right Top tagline",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "rightTitle",
    //             displayName: "Right Main Title",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "rightDescriptions",
    //             displayName: "Right Description",
    //             type: "textarea",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "testimonialsRightRepeater",
    //             displayName: "Highlighted Rows",
    //             type: "testimonialsRightRepeater",
    //             defaultValue: []
    //         },

    //         // testimonialsRightRepeater
    //     ]
    // },

    // {
    //     name: "Call Us Now",
    //     category: "home",
    //     customName: "callUsNow",
    //     defaultProps: {
    //         mainTitle: "",
    //         description: "",
    //         contactNumber: "",
    //         rightImage: "",
    //     },
    //     propDefinitions: [
    //         {
    //             name: "mainTitle",
    //             displayName: "Main Title",
    //             type: "text",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "description",
    //             displayName: "Description",
    //             type: "textarea",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "contactNumber",
    //             displayName: "Contact Number",
    //             type: "number",
    //             defaultValue: ""
    //         },
    //         {
    //             name: "rightImage",
    //             displayName: "Select a right image",
    //             type: "image",
    //             defaultValue: ""
    //         },
    //     ]
    // },

    // {
    //     name: "CustomCard",
    //     category: "custom",
    //     defaultProps: {
    //         title: "Card Title",
    //         description: "Card Description",
    //         variant: "default",
    //         backgroundColor: "#ffffff",
    //         padding: "4"
    //     },
    //     propDefinitions: [
    //         {
    //             name: "title",
    //             type: "text",
    //             defaultValue: "Card Title"
    //         },
    //         {
    //             name: "description",
    //             type: "text",
    //             defaultValue: "Card Description"
    //         },
    //         {
    //             name: "variant",
    //             type: "select",
    //             options: ["default", "bordered", "elevated", "flat"],
    //             defaultValue: "default"
    //         },
    //         {
    //             name: "backgroundColor",
    //             type: "color",
    //             defaultValue: "#ffffff"
    //         },
    //         {
    //             name: "padding",
    //             type: "select",
    //             options: ["2", "4", "6", "8"],
    //             defaultValue: "4"
    //         }
    //     ]
    // }
];