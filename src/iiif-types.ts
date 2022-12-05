import { Bindings } from "@rdfjs/types";

const TAB_OUTPUT = "- ";

export class Canvas {
  // Properties
  private _id: string;
  private _label: string;
  private _height: number;
  private _width: number;
  private _image: Image;

  // Getters
  public get id(): string {
    return this._id;
  }
  public get label(): string {
    return this._label;
  }
  public get height(): number {
    return this._height;
  }
  public get width(): number {
    return this._width;
  }
  public get image(): Image {
    return this._image;
  }

  // Setters
  public set id(value: string) {
    this._id = value;
  }
  public set label(value: string) {
    this._label = value;
  }
  public set height(value: number) {
    this._height = value;
  }
  public set width(value: number) {
    this._width = value;
  }
  public set image(value: Image) {
    this._image = value;
  }

  // Constructors
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

  // Public methods
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

  // Static methods
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
  // Properties
  private _attribution: string;
  private _license: string;
  private _motivation: string;
  private _on: string;
  private _resource: Resource;

  // Getters
  public get attribution(): string {
    return this._attribution;
  }
  public get license(): string {
    return this._license;
  }
  public get motivation(): string {
    return this._motivation;
  }
  public get on(): string {
    return this._on;
  }
  public get resource(): Resource {
    return this._resource;
  }

  // Setters
  public set attribution(value: string) {
    this._attribution = value;
  }
  public set license(value: string) {
    this._license = value;
  }
  public set motivation(value: string) {
    this._motivation = value;
  }
  public set on(value: string) {
    this._on = value;
  }
  public set resource(value: Resource) {
    this._resource = value;
  }

  // Constructors
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

  // Public methods
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

  // Static methods
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
  // Properties
  private _id: string;
  private _format: string;
  private _height: number;
  private _width: number;
  private _service: Service;

  // Getters
  public get id(): string {
    return this._id;
  }
  public get format(): string {
    return this._format;
  }
  public get height(): number {
    return this._height;
  }
  public get width(): number {
    return this._width;
  }
  public get service(): Service {
    return this._service;
  }

  // Setters
  public set id(value: string) {
    this._id = value;
  }
  public set format(value: string) {
    this._format = value;
  }
  public set height(value: number) {
    this._height = value;
  }
  public set width(value: number) {
    this._width = value;
  }
  public set service(value: Service) {
    this._service = value;
  }

  // Constructors
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

  // Public methods
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

  // Static methods
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
  // Properties
  private _id: string;
  private _profile: string;

  // Getters
  public get id(): string {
    return this._id;
  }
  public get profile(): string {
    return this._profile;
  }

  // Setters
  public set id(value: string) {
    this._id = value;
  }
  public set profile(value: string) {
    this._profile = value;
  }

  // Constructors
  constructor(id: string, profile: string) {
    this.id = id;
    this.profile = profile;
  }

  // Public methods
  toString(depth = 0): string {
    const tab = TAB_OUTPUT.repeat(depth);
    return `
${tab}id: ${this.id}
${tab}profile: ${this.profile}
    `;
  }

  // Static methods
  static fromBindings(bindings: Bindings) {
    return new Service(
      bindings.get("service").value,
      bindings.get("service_profile").value
    );
  }
}
