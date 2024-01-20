export function sanitizeFileName(fileName: string) {
  // 定义不允许出现在文件名中的字符
  const invalidChars = ["/", "\\", ":", "*", "?", '"', "<", ">", "|"];

  // 替换不允许的字符为空格
  const sanitizedFileName = fileName.replace(
    new RegExp("[" + invalidChars.join("") + "]", "g"),
    " "
  );

  return sanitizedFileName;
}

export function decodeHtmlEntities(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
}
