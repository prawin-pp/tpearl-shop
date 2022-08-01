export interface IImage {
  id: string;
  attributes: {
    name: string;
    alternativeText: string;
    formats: {
      small: IImageDetail;
      medium: IImageDetail;
      thumbnail: IImageDetail;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
  };
}

export interface IImageDetail {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string;
  size: number;
  width: number;
  height: number;
}
