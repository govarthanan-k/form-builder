import Form from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  type: "object",
  required: ["title"],
  properties: {
    title: { type: "string", title: "Title", default: "A new task" },
    done: { type: "boolean", title: "Done?", default: false },
  },
};

const log = (type: string) => console.log.bind(console, type);

export const Check = () => {
  return (
    <Form schema={schema} validator={validator} onChange={log("changed")} onSubmit={log("submitted")} onError={log("errors")} />
  );
};
