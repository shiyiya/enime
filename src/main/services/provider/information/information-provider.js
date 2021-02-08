export default class InformationProvider {
  constructor() {
    if (new.target === InformationProvider) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  name() {
    throw Error("The provider name cannot be null");
  }

  information(title) {
    return Promise.reject(new Error("The provider information fetch needs an implementation"));
  }
}
