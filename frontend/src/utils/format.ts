import { translate } from "../i18n";

export function formatTime(value?: string) {
  if (!value) return translate("status.connecting");
  return new Intl.DateTimeFormat("uk-UA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(
    new Date(value),
  );
}

export function formatCoordinate(value?: number | null) {
  if (value === undefined || value === null) return translate("object.notAvailable");
  return value.toFixed(2);
}

export function humanType(type: string) {
  return translate(`types.${type}`, translate("types.unknown"));
}

export function humanStatus(status: string) {
  return translate(`status.${status}`, translate("status.unknown"));
}
