export default class InformationProvider {
  constructor() {
    if (new.target === InformationProvider) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  name() {
    throw Error("The provider name cannot be null");
  }

  seek(title) {
    return Promise.reject(new Error("The provider information fetch needs an implementation"));
  }

  information(id) {
    return Promise.reject(new Error("The provider information fetch needs an implementation"));
  }

  extractActualTitle(title) {
    [
      /\b(?<season>2)nd [Ss]eason\b/ig,
      /\b(?<season>3)rd [Ss]eason\b/ig,
      /\b[\(\[)]?[Ss]eason (?<season>\d+)[\)\]]?\b/ig,
      /\b[\(\[)]?[Ss]aison (?<season>\d+)[\)\]]?\b/ig,
      /[-._ ]S(?<season>\d+)(?=E\d)/ig,
      /\bS(?<season>\d+)\b/ig,
    ].forEach(regex => title = title.replaceAll(regex, ''));

    return title;
  }
}
