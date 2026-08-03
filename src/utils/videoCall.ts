export interface BooleanRef {
  current: boolean;
}

export interface CallEventData {
  room?: string | number;
  consultationId?: string | number;
  callId?: string;
}

export const beginCallAttempt = (guard: BooleanRef): boolean => {
  if (guard.current) return false;
  guard.current = true;
  return true;
};

export const finishCallAttempt = (guard: BooleanRef): void => {
  guard.current = false;
};

export const createCallId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const isCallEventForConsultation = (
  event: CallEventData,
  consultationId: string | number,
): boolean => {
  const eventConsultationId = event.consultationId ?? event.room;
  return String(eventConsultationId) === String(consultationId);
};

export const isCallEventForActiveCall = (
  event: CallEventData,
  consultationId: string | number,
  activeCallId?: string | null,
): boolean => {
  if (!isCallEventForConsultation(event, consultationId)) return false;
  if (!activeCallId || !event.callId) return true;
  return event.callId === activeCallId;
};
