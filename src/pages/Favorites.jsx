import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, Trash2, ExternalLink, Folder } from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setFavorites(user.favorites || []);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
    setIsLoading(false);
  };

  const removeFavorite = async (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    await User.updateMyUserData({ favorites: updated });
  };

  const groupedFavorites = favorites.reduce((acc, fav) => {
    if (!acc[fav.category]) acc[fav.category] = [];
    acc[fav.category].push(fav);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-500" />
            Favorites
          </h1>
          <p className="text-gray-400">Quick access to your bookmarked items</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-[#0f0f0f] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No favorites yet</p>
              <p className="text-gray-500 text-sm">
                Star items throughout the platform to quickly access them here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFavorites).map(([category, items]) => (
              <Card key={category} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Folder className="w-5 h-5 text-[#DC2626]" />
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (item.url.startsWith('http')) {
                                  window.open(item.url, '_blank');
                                } else {
                                  navigate(createPageUrl(item.url));
                                }
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFavorite(item.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}