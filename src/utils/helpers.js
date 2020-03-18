const helpers = {
  getNestedField: getNestedField,
  getInfoFromOptions: getInfoFromOptions,
  clone: clone,
  sleep: sleep
};

export { helpers };

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getNestedField(resource, field) {
  if (!field) {
    return "";
  }

  var fields = field.split(".");

  for (var i = 0; i < fields.length; i++) {
    if (resource != null) {
      resource = resource[fields[i]];
    }
  }

  return resource;
}

function getInfoFromOptions(resource, header, infoType) {
  let tagId = getNestedField(resource, header.value);
  let tagField = "name";
  let currentTag = {};

  if (
    header.option &&
    header.option.options &&
    !header.option.options.resource
  ) {
    tagField =
      (header.option.text ? header.option.text : header.field_name) || "name";
    let optionList = header.option.options.list || [];

    currentTag = optionList.find(e => e.id == tagId);
  } else {
    currentTag = tagId;
  }

  switch (infoType) {
    case "color":
      return currentTag ? currentTag.color : "#888";

    case "text":
      return currentTag ? currentTag[tagField] : "";
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
