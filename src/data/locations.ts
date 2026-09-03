export type Zone = {
  id: string;
  name: string;
};

export type Parish = {
  id: string;
  name: string;
  zones: Zone[];
};

export type Municipality = {
  id: string;
  name: string;
  parishes: Parish[];
};

export type State = {
  id: string;
  name: string;
  municipalities: Municipality[];
};

export type LocationSelection = {
  stateId: string;
  municipalityId: string;
  parishId: string;
  zoneId: string;
};

// Datos iniciales de prueba. Se pueden ampliar sin modificar el selector.
export const locations: State[] = [
  {
    id: "carabobo",
    name: "Carabobo",
    municipalities: [
      {
        id: "valencia",
        name: "Valencia",
        parishes: [
          {
            id: "parroquia-prueba-1",
            name: "Parroquia de prueba 1",
            zones: [
              { id: "zona-prueba-1", name: "Zona de prueba 1" },
              { id: "zona-prueba-2", name: "Zona de prueba 2" },
            ],
          },
          {
            id: "parroquia-prueba-2",
            name: "Parroquia de prueba 2",
            zones: [{ id: "zona-prueba-3", name: "Zona de prueba 3" }],
          },
        ],
      },
    ],
  },
];

export function getLocationDetails(selection: LocationSelection) {
  const state = locations.find((item) => item.id === selection.stateId);
  const municipality = state?.municipalities.find(
    (item) => item.id === selection.municipalityId,
  );
  const parish = municipality?.parishes.find(
    (item) => item.id === selection.parishId,
  );
  const zone = parish?.zones.find((item) => item.id === selection.zoneId);

  if (!state || !municipality || !parish || !zone) {
    return null;
  }

  return { state, municipality, parish, zone };
}
