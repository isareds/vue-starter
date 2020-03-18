import moment from 'moment';

export default {
  truncate: function(value, limit, no_dots) {
    if (value != undefined && value != null) {
      if (limit != undefined) {
        return value.length >= limit ? value.substring(0, limit) + (no_dots ? "":  '...') : value;
      } else {
        return value;
      }
    }
  },
  date: function(value, format, messages) {
    if (value != undefined && value != null) {
      if (format != undefined) {
        return moment(value).format(format);
      } else {
        return value;
      }
    }
    return messages || '';
  },
  digits: function(value, digits) {
    if (value != undefined && value != null) {
      if (digits != undefined) {
        return parseFloat(value).toFixed(digits);
      } else {
        return value;
      }
    }
  },
  count: function(value) {
    if (value != undefined && value != null) {
      return value.length;
    }
    return 0;
  },
  uppercase: function(value) {
    if (value != undefined && value != null) {
      return value.toUpperCase();
    }
  },
  capitalize: function(value) {
    if (value != undefined && value != null && value != '') {
      return value[0].toUpperCase() + value.substring(1, value.length);
    }
  },
  moment: function(value, format) {
    if(!value) return '';

    var date = moment(value);
    if(!date.isValid()) return '';

    return date.format(format ? format : 'll');
  },
  number: function(value) {
    let number;
    if (value < "999") {
      return value;
    }
    if (value < "999999") {
      number = value / 1000;
      return number.toFixed(1).replace(".", ",") + " K";
    }
    if (value < 999999999) {
      number = value / 1000000;
      return number.toFixed(1).replace(".", ",") + " M";
    }
  }
};
