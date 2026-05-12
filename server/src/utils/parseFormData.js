const parseFormData = (body) => {
  const parsed = { ...body };

  Object.keys(parsed).forEach(
    (key) => {
      if (
        !isNaN(parsed[key]) &&
        parsed[key] !== ""
      ) {
        parsed[key] = Number(
          parsed[key]
        );
      }

      if (
        parsed[key] === "true"
      ) {
        parsed[key] = true;
      }

      if (
        parsed[key] === "false"
      ) {
        parsed[key] = false;
      }
    }
  );

  return parsed;
};

export default parseFormData;