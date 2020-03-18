import axios from "axios";
import { getToken, hasActiveRole, getActiveRole } from "./auth.js";

// TODO: refactor const in a const file to import!
const HOST = process.env.API_HOST || "";
//const API_URL = HOST + "/api";
const BASE_URL = HOST + "/";

var API_URL = HOST + "/api";

console.log("Init api endpoint con ", API_URL);

axios.interceptors.request.use(
  function(config) {
    var authToken = getToken();

    if (authToken == null) {
      // Send to login!
    } else {
      config.headers.common["Authorization"] = "Bearer " + authToken;
      axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;

      if (hasActiveRole()) {
        axios.defaults.headers.common["activerole"] = getActiveRole();
      } else {
        delete axios.defaults.headers.common["activerole"];
      }
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const api = {
  act: act,
  list: list,
  get: get,
  image: image,
  imageUrl: imageUrl,
  create: create,
  update: update,
  delete: _delete,
  post: post,
  upload: upload,
  download: download
};

export { api };

function list(resourceName, filter) {
  return new Promise(function(resolve, reject) {
    axios
      .get(API_URL + "/" + resourceName, {
        params: filter
      })
      .then(
        function(data) {
          resolve(data.data);
        },
        function(err) {
          reject(err);
        }
      );
  });
}

async function create(resourceName, resource) {
  let result = {
    error: null,
    resource: null
  };

  try {
    result.resource = await axios.post(
      API_URL + "/" + resourceName + "/",
      resource
    );
  } catch (e) {
    result.error = e.response.data;
  }

  return result;
}

async function update(resourceName, resourceId, resource) {
  let result = await axios.put(
    API_URL + "/" + resourceName + "/" + resourceId,
    resource
  );

  console.log(result);

  return result;
}

function get(resourceName, id, params = {}, isBlob = false) {
  return new Promise(function(resolve, reject) {
    let url = "";

    if (id !== undefined) {
      url = API_URL + "/" + resourceName + "/" + id;
    } else {
      url = API_URL + "/" + resourceName;
    }

    axios
      .get(url, {
        params: params,
        responseType: isBlob ? "blob" : undefined
      })
      .then(
        function(data) {
          resolve(data.data);
        },
        function(err) {
          reject(err);
        }
      );
  });
}

function image(resourceName, id) {
  return new Promise(function(resolve, reject) {
    axios.get(API_URL + "/" + resourceName + "/" + id + "/").then(
      function(data) {
        resolve({
          mimeType: data.headers["content-type"],
          imageBlob: data.data
        });
      },
      function(err) {
        reject(err);
      }
    );
  });
}

function imageUrl(imageUrl) {
  return BASE_URL + imageUrl;
}

function post(resourceName, params) {
  return new Promise(function(resolve, reject) {
    axios.post(API_URL + "/" + resourceName, params).then(
      function(data) {
        resolve(data.data);
      },
      function(err) {
        reject(err.response.data);
      }
    );
  });
}

function act(resourceName, resourceId, actionName, params) {
  console.log(params);
  return new Promise(function(resolve, reject) {
    axios
      .post(
        API_URL + "/" + resourceName + "/" + resourceId + "/act/" + actionName,
        params
      )
      .then(
        function(data) {
          resolve(data.data);
        },
        function(err) {
          reject(err.response.data);
        }
      );
  });
}

function _delete(resourceName, id) {
  return new Promise(function(resolve, reject) {
    axios.delete(API_URL + "/" + resourceName + "/" + id).then(
      function(data) {
        resolve(data.data);
      },
      function(err) {
        reject(err);
      }
    );
  });
}

function upload(data, url) {
  return new Promise(function(resolve, reject) {
    var params = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };

    axios
      .post(API_URL + "/" + url, data, params)
      .then(function(result) {
        resolve(result.data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function download(url, filter) {
  return new Promise(function(resolve, reject) {
    var params = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      responseType: "blob",
      params: filter
    };

    axios
      .get(API_URL + "/download/" + url, params)
      .then(function(data) {
        resolve({
          blob: data.data,
          fileName: data.headers["filename"],
          mime: data.headers["content-type"]
        });
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
