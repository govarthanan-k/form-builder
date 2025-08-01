"use client";

import { useEffect, useState } from "react";

import { RulesBuilder } from "@/components/RulesBuilderPlugin";

const initialRules = [
  {
    conditions: {
      username: "empty",
    },
    event: {
      type: "remove",
      params: {
        fields: ["password", "confirmPassword"],
      },
    },
  },
  {
    conditions: {
      or: [
        {
          username: {
            equal: "admin",
          },
        },
        {
          username: {
            equal: "superuser",
          },
        },
      ],
    },
    event: {
      type: "remove",
      params: {
        fields: ["confirmPassword"],
      },
    },
  },
];

export default function EFormDesigner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <RulesBuilder />;
}
