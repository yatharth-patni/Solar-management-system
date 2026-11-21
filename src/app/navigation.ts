import { NavigationSection, ROUTES, RouteConfig } from './routes';

export const getRouteConfig = (section: NavigationSection): RouteConfig => {
  return ROUTES.find(r => r.id === section) || ROUTES[0];
};

export const getBreadcrumbs = (section: NavigationSection): { label: string; active?: boolean }[] => {
  const config = getRouteConfig(section);
  if (section === 'overview') {
    return [{ label: 'SolarOS', active: false }, { label: 'Platform Suite', active: false }, { label: 'Platform Telemetry', active: true }];
  }
  return [
    { label: 'SolarOS', active: false },
    { label: config.section, active: false },
    { label: config.label, active: true },
  ];
};
