"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";


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

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to prevent any caching
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/site/home-page?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch home data');
      }

      const { data } = await res.json();
      setHomeData(data);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
    
    // Set up polling to check for updates every 30 seconds
    const interval = setInterval(fetchHomeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const renderComponent = (component: PageComponent) => {
    const Component = componentMap[component.customName];

    if (!Component) {
      console.warn(`Component ${component.customName} not found in componentMap`);
      return null;
    }

    return <Component serviceItems={[]} key={component.id} {...component.props} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center flex items-center justify-center flex-col">
          <Loader2 size={24} className="animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchHomeData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!homeData?.pageData?.components || homeData.pageData.components.length === 0) {
    return <div>No components to display</div>;
  }

  console.log("pageData.components===", homeData.pageData.components);

  return (
    <div>
      {homeData.pageData.components.map((component: PageComponent) => renderComponent(component))}
    </div>
  );
};

export default Home;
