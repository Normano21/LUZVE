import type { LocationSelection } from "../data/locations";

export const REPORT_WINDOW_MS = 15 * 60 * 1000;
export const REPORT_COOLDOWN_MS = 5 * 60 * 1000;

export type ReportStatus = "HAY_LUZ" | "NO_HAY_LUZ";

export type LocalReport = {
  id: string;
  deviceId: string;
  location: LocationSelection;
  status: ReportStatus;
  createdAt: string;
};

export type CommunityStatus =
  | { kind: "INSUFFICIENT" }
  | { kind: "CONFIRMED"; status: ReportStatus; reporterCount: number };

function isSameLocation(
  first: LocationSelection,
  second: LocationSelection,
) {
  return (
    first.stateId === second.stateId &&
    first.municipalityId === second.municipalityId &&
    first.parishId === second.parishId &&
    first.zoneId === second.zoneId
  );
}

function getTimestamp(report: LocalReport) {
  return new Date(report.createdAt).getTime();
}

export function getReportsForLocation(
  reports: LocalReport[],
  location: LocationSelection,
) {
  return reports
    .filter((report) => isSameLocation(report.location, location))
    .filter((report) => Number.isFinite(getTimestamp(report)))
    .sort((first, second) => getTimestamp(second) - getTimestamp(first));
}

export function getRecentReports(
  reports: LocalReport[],
  location: LocationSelection,
  now: number,
) {
  return getReportsForLocation(reports, location).filter(
    (report) => now - getTimestamp(report) <= REPORT_WINDOW_MS,
  );
}

export function getCommunityStatus(
  reports: LocalReport[],
  location: LocationSelection,
  now: number,
): CommunityStatus {
  const latestReportByDevice = new Map<string, LocalReport>();

  for (const report of getRecentReports(reports, location, now)) {
    if (!latestReportByDevice.has(report.deviceId)) {
      latestReportByDevice.set(report.deviceId, report);
    }
  }

  const deviceReports = [...latestReportByDevice.values()];
  const reportsWithLight = deviceReports.filter(
    (report) => report.status === "HAY_LUZ",
  );
  const reportsWithoutLight = deviceReports.filter(
    (report) => report.status === "NO_HAY_LUZ",
  );

  if (reportsWithLight.length > 0 && reportsWithoutLight.length > 0) {
    return { kind: "INSUFFICIENT" };
  }

  if (reportsWithLight.length >= 2) {
    return {
      kind: "CONFIRMED",
      status: "HAY_LUZ",
      reporterCount: reportsWithLight.length,
    };
  }

  if (reportsWithoutLight.length >= 2) {
    return {
      kind: "CONFIRMED",
      status: "NO_HAY_LUZ",
      reporterCount: reportsWithoutLight.length,
    };
  }

  return { kind: "INSUFFICIENT" };
}

export function canSubmitReport(
  reports: LocalReport[],
  location: LocationSelection,
  deviceId: string,
  status: ReportStatus,
  now: number,
) {
  const latestDeviceReport = getReportsForLocation(reports, location).find(
    (report) => report.deviceId === deviceId,
  );

  if (
    latestDeviceReport &&
    latestDeviceReport.status === status &&
    now - getTimestamp(latestDeviceReport) < REPORT_COOLDOWN_MS
  ) {
    return false;
  }

  return true;
}
