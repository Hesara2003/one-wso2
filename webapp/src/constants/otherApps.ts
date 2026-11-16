// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { otherAppUrls } from "@config/apiConfig";
import {
  AppWindowIcon,
  BookUserIcon,
  CalendarRangeIcon,
  ChartLineIcon,
  ClipboardListIcon,
  CloudIcon,
  CodeIcon,
  CompassIcon,
  DraftingCompassIcon,
  FileTextIcon,
  GaugeIcon,
  GitBranchIcon,
  GlobeIcon,
  HammerIcon,
  HeadsetIcon,
  KeyRoundIcon,
  LandmarkIcon,
  PackageIcon,
  PackagePlusIcon,
  PlaneIcon,
  PlugIcon,
  PrinterIcon,
  QrCodeIcon,
  ReceiptTextIcon,
  ServerCogIcon,
  StoreIcon,
  WifiIcon,
  WrenchIcon,
  type LucideIcon,
} from "@wso2/oxygen-ui-icons-react";
import type { PerspectiveSection } from "@constants/perspectives";

/** The perspectives whose rail ends with an "Other apps" group. */
export type OtherAppPerspective = "finance" | "sales" | "knowledge" | "engineering" | "infra" | "security" | "me";

/** A WSO2 tool One WSO2 links to but does not host. */
export interface OtherApp {
  /** Key of the app's address in `ONE_WSO2_OTHER_APP_URLS`. */
  id: string;
  label: string;
  perspective: OtherAppPerspective;
  icon: LucideIcon;
  /** Reachable only on the WSO2 VPN; the rail says so after the label. */
  vpnOnly?: boolean;
  /**
   * Linked from a group the rail already has for this app (see `otherAppRow`),
   * so it is left out of the "Other apps" group.
   */
  inOwnGroup?: boolean;
}

/** Label of the rail group that holds a perspective's other apps. */
export const OTHER_APPS_GROUP_LABEL = "Other apps";

/** Text appended to the label of an app reachable only on the VPN. */
export const VPN_ONLY_SUFFIX = " (VPN)";

/** Every linked app, in rail order within each perspective. */
export const OTHER_APPS: readonly OtherApp[] = [
  { id: "allocations", label: "Allocations", perspective: "finance", icon: CalendarRangeIcon },
  { id: "netsuite", label: "NetSuite", perspective: "finance", icon: LandmarkIcon },

  { id: "salesforce", label: "Salesforce", perspective: "sales", icon: CloudIcon },
  { id: "sales-pitstop", label: "Open Sales Pitstop", perspective: "sales", icon: StoreIcon, inOwnGroup: true },
  { id: "sales-insights-dashboard", label: "Sales Insights Dashboard", perspective: "sales", icon: ChartLineIcon },

  { id: "explorecs", label: "ExploreCS", perspective: "knowledge", icon: CompassIcon },
  { id: "cs-tools", label: "CS Tools", perspective: "knowledge", icon: WrenchIcon },
  { id: "cs-tooling-site", label: "CS Tooling Development Site", perspective: "knowledge", icon: CodeIcon },
  { id: "sa-site", label: "Solutions Architecture Site", perspective: "knowledge", icon: DraftingCompassIcon },

  { id: "wso2-github", label: "WSO2 GitHub", perspective: "engineering", icon: GitBranchIcon },
  { id: "support-github", label: "Support GitHub", perspective: "engineering", icon: GitBranchIcon },
  { id: "nexus", label: "WSO2 Nexus Repository", perspective: "engineering", icon: PackageIcon },
  { id: "public-jenkins", label: "Public Jenkins", perspective: "engineering", icon: HammerIcon, vpnOnly: true },
  { id: "support-jenkins", label: "Support Jenkins", perspective: "engineering", icon: HammerIcon, vpnOnly: true },
  {
    id: "github-committership-form",
    label: "GitHub Committership Request",
    perspective: "engineering",
    icon: ClipboardListIcon,
  },
  { id: "connector-store-docs", label: "Connector Store Documentation", perspective: "engineering", icon: PlugIcon },
  { id: "apim-site", label: "APIM Site", perspective: "engineering", icon: GlobeIcon },
  { id: "support-portal-lite", label: "Support Portal Lite", perspective: "engineering", icon: HeadsetIcon },

  { id: "vpn-setup-guide", label: "VPN Setup Guide", perspective: "infra", icon: KeyRoundIcon },
  { id: "vpn-qr-code", label: "My VPN QR Code", perspective: "infra", icon: QrCodeIcon },
  { id: "guest-wifi", label: "Guest WiFi", perspective: "infra", icon: WifiIcon, vpnOnly: true },
  { id: "network-printer-guide", label: "Network Printer Setup Guide", perspective: "infra", icon: PrinterIcon },
  { id: "diy-infra-portal", label: "DIY Infra Portal", perspective: "infra", icon: ServerCogIcon, vpnOnly: true },
  {
    id: "new-software-request",
    label: "Request Approval for New Software",
    perspective: "infra",
    icon: PackagePlusIcon,
  },

  { id: "security-compliance-site", label: "Security & Compliance Site", perspective: "security", icon: FileTextIcon },
  {
    id: "security-self-service-dashboard",
    label: "Security Self-Service Dashboard",
    perspective: "security",
    icon: GaugeIcon,
  },

  { id: "travel", label: "Travel", perspective: "me", icon: PlaneIcon },
  { id: "msl-payslip", label: "MSL Payslip Viewer", perspective: "me", icon: ReceiptTextIcon },
  { id: "hr-site", label: "HR Site", perspective: "me", icon: BookUserIcon },
];

/**
 * The "Other apps" rail group for a perspective: one row per linked app that has
 * an address, each opening it in a new tab.
 *
 * @param perspective - The perspective whose apps to list.
 * @param urls - App id → address; defaults to `ONE_WSO2_OTHER_APP_URLS`.
 * @returns The group as the only element, or no elements when none of the
 *   perspective's apps has an address.
 */
export function otherAppsSections(
  perspective: OtherAppPerspective,
  urls: Readonly<Record<string, string>> = otherAppUrls,
): PerspectiveSection[] {
  const rows = OTHER_APPS.filter((app) => app.perspective === perspective && !app.inOwnGroup).flatMap((app) =>
    rowFor(app, urls),
  );
  if (rows.length === 0) return [];
  return [
    {
      id: `${perspective}-other-apps`,
      label: OTHER_APPS_GROUP_LABEL,
      icon: AppWindowIcon,
      alwaysGroup: true,
      children: rows,
    },
  ];
}

/**
 * The rail row for one linked app, for a group the rail already has for it.
 *
 * @param id - The app's id in `OTHER_APPS`.
 * @param urls - App id → address; defaults to `ONE_WSO2_OTHER_APP_URLS`.
 * @returns The row as the only element, or no elements when the app has no address.
 */
export function otherAppRow(
  id: string,
  urls: Readonly<Record<string, string>> = otherAppUrls,
): PerspectiveSection[] {
  const app = OTHER_APPS.find((candidate) => candidate.id === id);
  return app ? rowFor(app, urls) : [];
}

/** The row that opens `app` in a new tab, or none when it has no address. */
function rowFor(app: OtherApp, urls: Readonly<Record<string, string>>): PerspectiveSection[] {
  const url = urls[app.id] ?? "";
  if (!url) return [];
  return [
    {
      id: `other-app-${app.id}`,
      label: app.vpnOnly ? `${app.label}${VPN_ONLY_SUFFIX}` : app.label,
      icon: app.icon,
      onSelect: () => {
        window.open(url, "_blank", "noopener,noreferrer");
      },
      opensInNewTab: true,
    },
  ];
}
