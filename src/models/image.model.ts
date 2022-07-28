export interface ImageModel {
  id: string;
  name: string;
  alternativeText: string;
  formats: {
    small: ImageDetail;
    thumbnail: ImageDetail;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
}

export interface ImageDetail {
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
