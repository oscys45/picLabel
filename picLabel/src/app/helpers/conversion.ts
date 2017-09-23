

export class ConversionHelper {

  /**
   * String to binary array (adds nulls)
   * @param {string} str
   * @returns {Array}
   */
  public static string2Bin(str: string) {

    let result = [];

    if (str) {
      for (let i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
        result.push(0);
      }
      result.push(0);
      result.push(0);
    }

    return result;
  }

  /**
   * Binary array from JPEG to string.
   * @param array
   * @returns {any}
   */
  public static bin2String(array) {

    let result = "";

    if (array) {
      // Remove nulls.
      array.reduceRight((acc, item, index, object) => {
        if (item == 0) {
          object.splice(index, 1);
        }
      }, []);
      result = String.fromCharCode.apply(String, array);
    }

    return result;
  }
}
