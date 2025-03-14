import React, { useEffect } from "react";

function InputGroup({
  inputType,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  shortName,
  name,
  required,
}) {
  return (
    <div className="w-full">
      <div>
        <label htmlFor={shortName} className={required ? "required" : ""}>
          {name}
        </label>
        <input
          type={inputType ? inputType : "text"}
          name={shortName}
          placeholder={name}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[shortName]}
          pattern={shortName === "phoneNumber" ? "^[+0-9]{3,11}$" : null}
          title={shortName === "phoneNumber" ? "You can only enter numbers, with a minimal of 3 characters upto 11 characters are accepted." : null}
          className={`${shortName === "weight" ? "input-weight" : ""} px-3 w-full h-10 text-sm rounded-md ${
            errors[shortName] && touched[shortName] && errors[shortName]
              ? "border-2 border-red-500"
              : null
          }`}
        />
        <p className="text-red-500 text-xs error-text h-8">
          {errors[shortName] && touched[shortName] && errors[shortName]}
        </p>
      </div>
    </div>
  );
}

export default InputGroup;
