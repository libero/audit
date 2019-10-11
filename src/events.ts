import { Event, EventIdentifier } from "@libero/event-bus";

export type ServiceStartedPayload = {
  name: string;
  type: string;
};

export const serviceStartedIdentifier: EventIdentifier = {
  kind: "ServiceStarted",
  namespace: "infra-global"
};

export type UserLoggedInPayload = {
  name: string;
  userId: string;
  email: string;
  timestamp: Date;
};

export const userLoggedInIdentifier: EventIdentifier = {
  kind: "UserLoggedIn",
  namespace: "user-audit",
};
