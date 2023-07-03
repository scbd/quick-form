//https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
function testImage(url, callback, timeout) {
  timeout = timeout || 5000;
  var timedOut = false, timer;
  var img = new Image();
  img.onerror = img.onabort = function() {
      if (!timedOut) {
          clearTimeout(timer);
          callback(url, "error");
      }
  };
  img.onload = function() {
      if (!timedOut) {
          clearTimeout(timer);
          callback(url, "success");
      }
  };
  img.src = url;
  timer = setTimeout(function() {
      timedOut = true;
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = "//!!!!/test.jpg";
      callback(url, "timeout");
  }, timeout); 
}

export function isImageUrl(url) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export function isEncodingImage(type) {
  const acceptedImageTypes = [ 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/apng', 'image/avif', 'image/webp' ];

  return acceptedImageTypes.includes(type)
}

export function getImageMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
    let header = '';
    for (let i = 0; i < byteArray.length; i++) {
       header += byteArray[i].toString(16);
    }
	switch (header) {
        case "89504e47":
            return "image/png";
        case "47494638":
            return "image/gif";
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
            return "image/jpeg";
        default:
            return fallback;
    }
}
