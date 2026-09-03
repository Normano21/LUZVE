"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getLocationDetails,
  locations,
  type LocationSelection,
} from "../data/locations";
import {
  canSubmitReport,
  getCommunityStatus,
  getReportsForLocation,
  type LocalReport,
  type ReportStatus,
} from "../lib/reports";

const LOCATION_STORAGE_KEY = "luzve-selected-location";
const REPORTS_STORAGE_KEY = "luzve-local-reports";
const DEVICE_ID_STORAGE_KEY = "luzve-device-id";

type SelectorStep = "state" | "municipality" | "parish" | "zone";

const selectorTitles: Record<SelectorStep, string> = {
  state: "Selecciona tu estado",
  municipality: "Selecciona tu municipio",
  parish: "Selecciona tu parroquia",
  zone: "Selecciona tu zona",
};

function readLocalReports() {
  const savedReports = window.localStorage.getItem(REPORTS_STORAGE_KEY);

  if (!savedReports) {
    return [];
  }

  try {
    const parsedReports = JSON.parse(savedReports);

    return Array.isArray(parsedReports) ? (parsedReports as LocalReport[]) : [];
  } catch {
    return [];
  }
}

function createDeviceId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatReportTime(report: LocalReport) {
  return new Intl.DateTimeFormat("es-VE", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(report.createdAt));
}

export default function Home() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorStep, setSelectorStep] = useState<SelectorStep>("state");
  const [selection, setSelection] = useState<LocationSelection | null>(null);
  const [draftSelection, setDraftSelection] = useState<Partial<LocationSelection>>({});
  const [reports, setReports] = useState<LocalReport[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [reportMessage, setReportMessage] = useState("");

  const savedLocation = selection ? getLocationDetails(selection) : null;
  const selectedState = locations.find(
    (item) => item.id === draftSelection.stateId,
  );
  const selectedMunicipality = selectedState?.municipalities.find(
    (item) => item.id === draftSelection.municipalityId,
  );
  const selectedParish = selectedMunicipality?.parishes.find(
    (item) => item.id === draftSelection.parishId,
  );

  useEffect(() => {
    const savedSelection = window.localStorage.getItem(LOCATION_STORAGE_KEY);

    if (!savedSelection) {
      return;
    }

    try {
      const parsedSelection = JSON.parse(savedSelection) as LocationSelection;

      if (getLocationDetails(parsedSelection)) {
        const timeoutId = window.setTimeout(() => {
          setSelection(parsedSelection);
        }, 0);

        return () => window.clearTimeout(timeoutId);
      }
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
      const nextDeviceId = storedDeviceId ?? createDeviceId();

      if (!storedDeviceId) {
        window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, nextDeviceId);
      }

      setDeviceId(nextDeviceId);
      setReports(readLocalReports());
      setCurrentTime(Date.now());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const individualReport = useMemo(() => {
    if (!selection || !deviceId) {
      return null;
    }

    return getReportsForLocation(reports, selection).find(
      (report) => report.deviceId === deviceId,
    );
  }, [deviceId, reports, selection]);

  const communityStatus = selection
    ? getCommunityStatus(reports, selection, currentTime)
    : { kind: "INSUFFICIENT" as const };
  const communityIsConfirmed = communityStatus.kind === "CONFIRMED";
  const communityHasLight =
    communityIsConfirmed && communityStatus.status === "HAY_LUZ";
  const locationLabel = savedLocation
    ? `${savedLocation.zone.name}, ${savedLocation.municipality.name}, ${savedLocation.state.name}`
    : "Valencia, Carabobo";

  const canReportLight =
    Boolean(selection && deviceId) &&
    canSubmitReport(reports, selection!, deviceId!, "HAY_LUZ", currentTime);
  const canReportNoLight =
    Boolean(selection && deviceId) &&
    canSubmitReport(reports, selection!, deviceId!, "NO_HAY_LUZ", currentTime);

  function openSelector() {
    setDraftSelection(selection ?? {});
    setSelectorStep(selection ? "zone" : "state");
    setIsSelectorOpen(true);
  }

  function closeSelector() {
    setIsSelectorOpen(false);
  }

  function goBack() {
    const previousStep: Record<SelectorStep, SelectorStep | null> = {
      state: null,
      municipality: "state",
      parish: "municipality",
      zone: "parish",
    };
    const nextStep = previousStep[selectorStep];

    if (nextStep) {
      setSelectorStep(nextStep);
    }
  }

  function chooseState(stateId: string) {
    setDraftSelection({ stateId });
    setSelectorStep("municipality");
  }

  function chooseMunicipality(municipalityId: string) {
    setDraftSelection((current) => ({ ...current, municipalityId }));
    setSelectorStep("parish");
  }

  function chooseParish(parishId: string) {
    setDraftSelection((current) => ({ ...current, parishId }));
    setSelectorStep("zone");
  }

  function chooseZone(zoneId: string) {
    if (
      !draftSelection.stateId ||
      !draftSelection.municipalityId ||
      !draftSelection.parishId
    ) {
      return;
    }

    const completedSelection = {
      stateId: draftSelection.stateId,
      municipalityId: draftSelection.municipalityId,
      parishId: draftSelection.parishId,
      zoneId,
    };

    setSelection(completedSelection);
    setReportMessage("");
    window.localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(completedSelection),
    );
    closeSelector();
  }

  function submitReport(status: ReportStatus) {
    if (!selection || !deviceId) {
      return;
    }

    if (!canSubmitReport(reports, selection, deviceId, status, currentTime)) {
      setReportMessage("Ese mismo reporte ya fue enviado hace poco.");
      return;
    }

    const nextReport: LocalReport = {
      id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      deviceId,
      location: selection,
      status,
      createdAt: new Date(currentTime).toISOString(),
    };
    const nextReports = [nextReport, ...reports];

    setReports(nextReports);
    setReportMessage("Tu reporte fue guardado en este dispositivo.");
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(nextReports));
  }

  const communityTitle = communityIsConfirmed
    ? communityHasLight
      ? "CON ELECTRICIDAD"
      : "SIN ELECTRICIDAD"
    : "INFORMACIÓN INSUFICIENTE";
  const communityDescription = communityIsConfirmed
    ? `${communityStatus.reporterCount} dispositivos independientes coinciden en los últimos 15 minutos.`
    : "Aún no hay suficientes reportes comunitarios coincidentes para confirmar el estado de esta zona.";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between">
          <p className="text-xl font-extrabold tracking-tight text-amber-500">
            ⚡ LUZVE
          </p>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Valencia
          </span>
        </header>

        <section
          className="flex flex-1 flex-col justify-center py-12"
          aria-labelledby="status-title"
        >
          <button
            type="button"
            className="mb-12 flex w-fit items-center gap-2 text-left text-sm font-medium text-slate-600"
            onClick={openSelector}
            aria-haspopup="dialog"
            aria-expanded={isSelectorOpen}
          >
            <span aria-hidden="true">📍</span>
            <span>{locationLabel}</span>
            <span aria-hidden="true" className="text-slate-400">⌄</span>
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                communityIsConfirmed
                  ? communityHasLight
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-500"
              }`}
              aria-hidden="true"
            >
              ●
            </div>
            <p className="mb-3 text-xs font-bold tracking-[0.16em] text-slate-500">
              ESTADO COMUNITARIO
            </p>
            <h1
              id="status-title"
              className={`text-2xl font-extrabold tracking-tight ${
                communityIsConfirmed
                  ? communityHasLight
                    ? "text-emerald-700"
                    : "text-red-700"
                  : "text-slate-800"
              }`}
            >
              {communityTitle}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {communityDescription}
            </p>
            <div className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-500">
              <p className="font-semibold text-slate-700">TU ÚLTIMO REPORTE</p>
              {individualReport ? (
                <p>
                  {individualReport.status === "HAY_LUZ"
                    ? "HAY LUZ"
                    : "NO HAY LUZ"}
                  {` · ${formatReportTime(individualReport)}`}
                </p>
              ) : (
                <p>Aún no has enviado un reporte para esta zona.</p>
              )}
            </div>
          </div>
        </section>

        <footer className="space-y-4 pb-3">
          {communityIsConfirmed ? (
            <button
              type="button"
              className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${
                communityHasLight
                  ? "bg-red-600 hover:bg-red-500 focus:ring-red-200"
                  : "bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-200"
              }`}
              onClick={() =>
                submitReport(communityHasLight ? "NO_HAY_LUZ" : "HAY_LUZ")
              }
              disabled={communityHasLight ? !canReportNoLight : !canReportLight}
            >
              {communityHasLight ? "SE FUE LA LUZ" : "VOLVIÓ LA LUZ"}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm font-semibold text-slate-700">
                ¿Tienes electricidad ahora?
              </p>
              <button
                type="button"
                className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-base font-bold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => submitReport("HAY_LUZ")}
                disabled={!canReportLight}
              >
                SÍ, HAY LUZ
              </button>
              <button
                type="button"
                className="w-full rounded-2xl bg-red-600 px-5 py-4 text-base font-bold text-white transition-colors hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => submitReport("NO_HAY_LUZ")}
                disabled={!canReportNoLight}
              >
                NO, SE FUE LA LUZ
              </button>
            </div>
          )}

          {!selection && (
            <p className="text-center text-sm leading-6 text-slate-500">
              Selecciona una zona para poder enviar tu reporte.
            </p>
          )}
          {reportMessage && (
            <p className="text-center text-sm leading-6 text-slate-600" aria-live="polite">
              {reportMessage}
            </p>
          )}
          <button
            type="button"
            className="w-full py-2 text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4"
          >
            Ver historial
          </button>
        </footer>
      </div>

      {isSelectorOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-slate-950/30 sm:items-center sm:justify-center"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Cerrar selector de zona"
            onClick={closeSelector}
          />
          <section
            className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-selector-title"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
                  UBICACIÓN
                </p>
                <h2
                  id="location-selector-title"
                  className="mt-1 text-xl font-extrabold text-slate-800"
                >
                  {selectorTitles[selectorStep]}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-slate-500"
                onClick={closeSelector}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <p className="mb-4 text-sm leading-6 text-slate-500">
              Datos iniciales de prueba para Valencia, Carabobo.
            </p>

            <div className="space-y-2">
              {selectorStep === "state" &&
                locations.map((state) => (
                  <LocationOption
                    key={state.id}
                    label={state.name}
                    onClick={() => chooseState(state.id)}
                  />
                ))}
              {selectorStep === "municipality" &&
                selectedState?.municipalities.map((municipality) => (
                  <LocationOption
                    key={municipality.id}
                    label={municipality.name}
                    onClick={() => chooseMunicipality(municipality.id)}
                  />
                ))}
              {selectorStep === "parish" &&
                selectedMunicipality?.parishes.map((parish) => (
                  <LocationOption
                    key={parish.id}
                    label={parish.name}
                    onClick={() => chooseParish(parish.id)}
                  />
                ))}
              {selectorStep === "zone" &&
                selectedParish?.zones.map((zone) => (
                  <LocationOption
                    key={zone.id}
                    label={zone.name}
                    onClick={() => chooseZone(zone.id)}
                  />
                ))}
            </div>

            {selectorStep !== "state" && (
              <button
                type="button"
                className="mt-6 text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4"
                onClick={goBack}
              >
                Volver
              </button>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

type LocationOptionProps = {
  label: string;
  onClick: () => void;
};

function LocationOption({ label, onClick }: LocationOptionProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left font-semibold text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50"
      onClick={onClick}
    >
      {label}
      <span aria-hidden="true" className="text-slate-400">
        ›
      </span>
    </button>
  );
}
