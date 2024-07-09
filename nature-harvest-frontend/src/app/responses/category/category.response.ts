export class CategoryResponse {
  id: number;
  name: string;
  thumbnail: string;
  slug: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.slug = data.slug;
  }
}
