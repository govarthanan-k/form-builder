import {
  ariaDescribedByIds,
  descriptionId,
  FormContextType,
  getTemplate,
  labelValue,
  RJSFSchema,
  schemaRequiresTrueValue,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/** The `ToggleWidget` is a widget for rendering boolean properties.
 *  It is typically used to represent a boolean using a toggle switch.
 *
 * @param props - The `WidgetProps` for this component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ToggleWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>
) {
  const {
    autofocus,
    disabled,
    hideLabel,
    id,
    label,
    onBlur,
    onChange,
    onFocus,
    options,
    readonly,
    registry,
    schema,
    uiSchema,
    value,
  } = props;

  const required = schemaRequiresTrueValue<S>(schema);
  const DescriptionFieldTemplate = getTemplate<"DescriptionFieldTemplate", T, S, F>(
    "DescriptionFieldTemplate",
    registry,
    options
  );

  const _onChange = (checked: boolean) => onChange(checked);
  const _onBlur = () => onBlur(id, value);
  const _onFocus = () => onFocus(id, value);

  const description = options.description || schema.description;

  return (
    <div
      className={`relative ${disabled || readonly ? "cursor-not-allowed opacity-50" : ""}`}
      aria-describedby={ariaDescribedByIds<T>(id)}
    >
      {!hideLabel && description && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(id)}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      <div className="my-2 flex items-center gap-2">
        <Switch
          id={id}
          name={id}
          required={required}
          checked={typeof value === "undefined" ? false : Boolean(value)}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onCheckedChange={_onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label className="leading-tight" htmlFor={id}>
          {labelValue(label, hideLabel || !label)}
        </Label>
      </div>
    </div>
  );
}
