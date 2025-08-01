import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Equal,
  EqualNot,
  Eye,
  EyeOff,
  Lock,
  LucideIcon,
  Shield,
  Trash2,
  UserCheck,
} from "lucide-react";

import { EventType, FieldIcons, Operator } from "./types";

export const defaultFieldIcons: FieldIcons = {
  username: UserCheck,
  password: Lock,
  confirmPassword: Shield,
};

export const eventIcons: Record<EventType, LucideIcon> = {
  remove: Trash2,
  hide: EyeOff,
  show: Eye,
  require: AlertCircle,
};

export const eventTypes: EventType[] = ["remove", "hide", "show", "require"];

export const operatorIcons: Record<Operator, LucideIcon> = {
  equal: Equal,
  notEqual: EqualNot,
  greater: ChevronUp,
  less: ChevronDown,
  empty: Circle,
};

export const operators: Operator[] = ["equal", "notEqual", "greater", "less", "empty"];

export const sampleFieldList: string[] = [
  "username",
  "password",
  "confirmPassword",
  "personalDetails",
  "personalDetails.firstName",
  "personalDetails.lastName",
  "personalDetails.address",
];
