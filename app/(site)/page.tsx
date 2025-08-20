import MainBanner from "../components/mainBanner";
import WelcomeSection from "../components/home/welcomeSection";
import WhatWeOffer from "../components/home/whatWeOffer";
import FareCalculator from "../components/home/fareCalculator";
import ChooseYourRide from "../components/home/chooseYourRide";
import CustomerReviews from "../components/home/customerReviews";
import CallUsNow from "../components/home/callUsNow";
import BlogSection from "../components/home/blogSection";
import NumberResults from "../components/home/numberResults";
import FeaturedServices from "../components/home/featuredServices";
import RecentProjects from "../components/home/recentProjects";
import OurBrandRow from "../components/home/ourBrandRow";
import GetQuote from "../components/home/getQuote";

// Force dynamic rendering - this ensures the page is not statically generated
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Type definitions
// Generic type for component props
type GenericProps = {
  [key: string]: unknown;  // More type-safe than 'any'
};

interface PageComponent {
  id: string;
  type: string;
  customName: keyof typeof componentMap;  // Ensures customName matches componentMap keys
  props: GenericProps;
}

// Component mapping object
const componentMap = {
  mainBanner: MainBanner,
  welcomeSection: WelcomeSection,
  numberResults: NumberResults,
  featuredServices: FeaturedServices,
  recentProjects: RecentProjects,
  ourBrandRow: OurBrandRow,
  getQuote: GetQuote,
  blogSection: BlogSection,
} as const;

// Helper function to get the base URL
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.SITE_ENV === 'development') {
    return 'http://localhost:1222';
  }
  return process.env.NEXTAUTH_URL || 'https://noblekey.lk';
}

async function getHomePageData() {
  try {
    // Add timestamp to prevent any caching
    const timestamp = new Date().getTime();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site/home-page?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        ...(process.env.NEXTAUTH_URL && { 'origin': process.env.NEXTAUTH_URL })
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch home data');
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}

export async function generateMetadata() {
  const baseUrl = getBaseUrl();
  const ogImageUrl = `${baseUrl}/images/og-image.png`;
  const homeData = await getHomePageData();

  return {
    title: homeData?.seoData?.basicSeo?.title || '',
    description: homeData?.seoData?.basicSeo?.description || '',
    keywords: homeData?.seoData?.basicSeo?.keywords || '',
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: homeData?.seoData?.basicSeo?.title || '',
      description: (homeData?.seoData?.ogSeo?.description || homeData?.seoData?.basicSeo?.description) || '',
      images: [
        {
          url: ogImageUrl,
          alt: homeData?.seoData?.basicSeo?.title || '',
          width: 1200,
          height: 630,
        },
      ],
      siteName: 'City Cabs France',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: homeData?.seoData?.basicSeo?.title || '',
      description: (homeData?.seoData?.ogSeo?.description || homeData?.seoData?.basicSeo?.description) || '',
      images: [ogImageUrl],
    },
  };
}

const Home: React.FC = async () => {
  const homeData = await getHomePageData();
  const { pageData } = homeData;

  const renderComponent = (component: PageComponent) => {
    const Component = componentMap[component.customName];

    if (!Component) {
      console.warn(`Component ${component.customName} not found in componentMap`);
      return null;
    }

    return <Component serviceItems={[]} key={component.id} {...component.props} />;
  };

  if (!pageData?.components || pageData.components.length === 0) {
    return <div>No components to display</div>;
  }

  console.log("pageData.components===", pageData.components);

  return (
    <div>
      {pageData.components.map((component: PageComponent) => renderComponent(component))}
    </div>
  );
};

export default Home;
