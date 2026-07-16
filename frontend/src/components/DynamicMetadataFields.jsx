export default function DynamicMetadataFields({
  categoria,
  fieldsByCategory,
  value,
  onChange,
  inputStyle = {},
}) {
  const fields = fieldsByCategory[categoria] || [];

  if (fields.length === 0) {
    return null;
  }

  function updateField(name, fieldValue) {
    onChange({
      ...(value || {}),
      [name]: fieldValue,
    });
  }

  return (
    <div className="row mt-3">
      {fields.map((field) => (
        <div className="col-md-6 mb-3" key={field.name}>
          <label>{field.label}</label>
          {field.options ? (
            <select
              className="form-select"
              value={(value || {})[field.name] || ""}
              onChange={(e) => updateField(field.name, e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecionar</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              className="form-control"
              rows={3}
              value={(value || {})[field.name] || ""}
              onChange={(e) => updateField(field.name, e.target.value)}
              style={inputStyle}
            />
          ) : (
            <input
              type={field.type || "text"}
              className="form-control"
              value={(value || {})[field.name] || ""}
              onChange={(e) => updateField(field.name, e.target.value)}
              style={inputStyle}
            />
          )}
        </div>
      ))}
    </div>
  );
}
