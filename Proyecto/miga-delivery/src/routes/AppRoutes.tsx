import React from 'react';

interface AppRoutesProps {
  activeTab: string;
  HomeView: React.ReactNode;
  TrackingView: React.ReactNode;
  AdminView: React.ReactNode;
  MyOrdersView: React.ReactNode;
  FavoritesView: React.ReactNode;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  activeTab,
  HomeView,
  TrackingView,
  AdminView,
  MyOrdersView,
  FavoritesView,
}) => {
  switch (activeTab) {
    case 'discover':
    case 'restaurants':
      return <>{HomeView}</>;
    case 'orders':
      return <>{MyOrdersView}</>;
    case 'favorites':
      return <>{FavoritesView}</>;
    case 'tracking':
      return <>{TrackingView}</>;
    case 'admin':
      return <>{AdminView}</>;
    default:
      return <>{HomeView}</>;
  }
};