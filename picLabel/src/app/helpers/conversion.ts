

export class ConversionHelper {

  /**
   *
   * @param {string} str
   * @returns {Array}
   */
  public static string2Bin(str: string) {

    let result = [];

    if (str) {
      for (let i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
      }
    }
    return result;
  }

  /**
   *
   * @param array
   * @returns {any}
   */
  public static bin2String(array) {
    return String.fromCharCode.apply(String, array);
  }
}
