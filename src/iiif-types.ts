import { Bindings } from "@rdfjs/types";

const TAB_OUTPUT = "- ";

export class Canvas {
  private id: string;
  private label: string;
  private height: number;
  private width: number;
  private image: Image;

  constructor(
    id: string,
    label: string,
    height: number,
    width: number,
    image: Image
  ) {
    this.id = id;
    this.label = label;
    this.height = height;
    this.width = width;
    this.image = image;
  }

  toString(depth = 0): string {
    const tab = TAB_OUTPUT.repeat(depth);
    return `
${tab}id: ${this.id}
${tab}label: ${this.label}
${tab}height: ${this.height}
${tab}width: ${this.width}
${tab}image: ${this.image.toString(depth + 1)}
    `;
  }

  static fromBindings(bindings: Bindings) {
    return new Canvas(
      bindings.get("canvas").value,
      bindings.get("canvas_label").value,
      parseInt(bindings.get("canvas_height").value),
      parseInt(bindings.get("canvas_width").value),
      Image.fromBindings(bindings)
    );
  }
}

export class Image {
  private attribution: string;
  private license: string;
  private motivation: string;
  private on: string;
  private resource: Resource;

  constructor(
    attribution: string,
    license: string,
    motivation: string,
    on: string,
    resource: Resource
  ) {
    this.attribution = attribution;
    this.license = license;
    this.motivation = motivation;
    this.on = on;
    this.resource = resource;
  }

  toString(depth = 0): string {
    const tab = TAB_OUTPUT.repeat(depth);
    return `
${tab}attribution: ${this.attribution}
${tab}license: ${this.license}
${tab}motivation: ${this.motivation}
${tab}on: ${this.on}
${tab}resource: ${this.resource.toString(depth + 1)}
    `;
  }

  static fromBindings(bindings: Bindings) {
    return new Image(
      bindings.get("image_attribution").value,
      bindings.get("image_license").value,
      bindings.get("image_motivation").value,
      bindings.get("image_on").value,
      Resource.fromBindings(bindings)
    );
  }
}

export class Resource {
  private id: string;
  private format: string;
  private height: number;
  private width: number;
  private service: Service;

  constructor(
    id: string,
    format: string,
    height: number,
    width: number,
    service: Service
  ) {
    this.id = id;
    this.format = format;
    this.height = height;
    this.width = width;
    this.service = service;
  }

  toString(depth = 0): string {
    const tab = TAB_OUTPUT.repeat(depth);
    return `
${tab}id: ${this.id}
${tab}format: ${this.format}
${tab}height: ${this.height}
${tab}width: ${this.width}
${tab}service: ${this.service.toString(depth + 1)}
    `;
  }

  static fromBindings(bindings: Bindings) {
    return new Resource(
      bindings.get("resource").value,
      bindings.get("resource_format").value,
      parseInt(bindings.get("resource_height").value),
      parseInt(bindings.get("resource_width").value),
      Service.fromBindings(bindings)
    );
  }
}

export class Service {
  private id: string;
  private profile: string;

  constructor(id: string, profile: string) {
    this.id = id;
    this.profile = profile;
  }

  toString(depth = 0): string {
    const tab = TAB_OUTPUT.repeat(depth);
    return `
${tab}id: ${this.id}
${tab}profile: ${this.profile}
    `;
  }

  static fromBindings(bindings: Bindings) {
    return new Service(
      bindings.get("service").value,
      bindings.get("service_profile").value
    );
  }
}
