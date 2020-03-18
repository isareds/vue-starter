import _ from "lodash";
import moment from "moment";

const helpers = {
  getNestedField: getNestedField,
  getInfoFromOptions: getInfoFromOptions,
  clone: clone,
  sleep: sleep,
  deepFind,
  getColor,
  createRandomArray,
  deepPick,
  moment
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

function deepFind(obj, path) {
  var paths = path.split("."),
    current = obj,
    i;

  if (!current) {
    return "";
  }

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }

  return current;
}

function getColor(colorString) {
  colorString = colorString ? colorString : "gray-400";

  let elem = document.querySelector(".color-swatch.bg-" + colorString);

  return elem != null ? getComputedStyle(elem).backgroundColor : "";
}

function createRandomArray(min, max, number) {
  let array = [];

  for (var i = 0; i < number; i++) {
    array.push(Math.round(Math.random() * max) + min);
  }

  return array;
}

function deepPick(object, nestedField, type = "text") {
  let value = _.get(object, nestedField);

  let round = function(value, round = 2) {
    return Number(value).toFixed(round);
  };

  switch (type) {
    case "number":
      return round(value);
    case "text":
      return value;
  }
}
