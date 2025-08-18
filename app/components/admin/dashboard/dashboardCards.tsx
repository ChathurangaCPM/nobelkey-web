"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  Image,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  pages: {
    total: number;
    recent: number;
    growth: number;
  };
  contacts: {
    total: number;
    recent: number;
    growth: number;
  };
  media: {
    total: number;
    recent: number;
    growth: number;
  };
}

interface DashboardCardsProps {
  data?: DashboardData;
  loading?: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ data, loading = false }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(data || null);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (!data) {
      fetchDashboardData();
    }
  }, [data]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error('Failed to fetch dashboard data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-400";
  };

  const cards = [
    {
      title: "Pages",
      icon: FileText,
      data: dashboardData?.pages,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Total website pages"
    },
    {
      title: "Contacts",
      icon: MessageSquare,
      data: dashboardData?.contacts,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Contact form submissions"
    },
    {
      title: "Media Files",
      icon: Image,
      data: dashboardData?.media,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Uploaded media files"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const cardData = card.data;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {cardData?.total || 0}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
                {cardData && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(cardData.growth)}
                    <span className={`text-xs font-medium ${getTrendColor(cardData.growth)}`}>
                      {cardData.growth > 0 ? '+' : ''}{cardData.growth}%
                    </span>
                  </div>
                )}
              </div>
              {cardData && cardData.recent > 0 && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {cardData.recent} this week
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;
