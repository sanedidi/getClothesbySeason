import { Controller } from "react-hook-form";

const FormSelect = ({
  control,
  name,
  options = [],
  required = false,
  defaultValue = "",
  placeholder = "Select an option",
  disabled = false,
  className,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={className}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p style={{ color: "red" }}>This field is required</p>}
        </>
      )}
    />
  );
};

export default FormSelect;
